import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill from "react-quill-new";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { supabase } from "../supabaseClient";

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],        
    [{'list': 'ordered'}, {'list': 'bullet'}],        
    [{ 'align': [] }],                                
    ['link', 'image'],                                
    ['clean']                                         
  ],
};

export default function Dashboard() {
  const [posts, setPosts] = useState([]);
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Announcement");
  const [imageFile, setImageFile] = useState(null); // Stores raw image file
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
  }, []);

  // 1. SELECT: Fetch posts from Supabase PostgreSQL
  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert("Error loading posts: " + error.message);
    } else {
      setPosts(data);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); // Store raw file object
    }
  };

  // 2. INSERT: Uploads file to bucket, retrieves URL, then inserts row
  const handleSavePost = async (e) => {
    e.preventDefault();
    if (!title || !content) return;
    setLoading(true);

    let coverImageUrl = "";

    // Upload cover image file to Supabase storage if selected
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `covers/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("osas-assets")
        .upload(filePath, imageFile);

      if (uploadError) {
        alert("Image upload failed: " + uploadError.message);
        setLoading(false);
        return;
      }

      // Retrieve public URL from bucket
      const { data: { publicUrl } } = supabase.storage
        .from("osas-assets")
        .getPublicUrl(filePath);

      coverImageUrl = publicUrl;
    }

    const { error: insertError } = await supabase
      .from("posts")
      .insert([
        {
          title,
          type,
          content,
          cover_image: coverImageUrl, // Stores actual URL
          author: author || "OSAS Admin",
          date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })
        }
      ]);

    if (insertError) {
      alert("Failed to publish: " + insertError.message);
    } else {
      setTitle("");
      setContent("");
      setImageFile(null);
      setAuthor("");
      setIsCreating(false);
      fetchPosts(); // Refresh list
    }
    setLoading(false);
  };

  // 3. DELETE: Deletes row from PostgreSQL
  const handleDeletePost = async (id) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", id);

      if (error) {
        alert("Delete failed: " + error.message);
      } else {
        fetchPosts(); // Refresh list
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-200 p-6 flex flex-col justify-between hidden md:flex">
        <div className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">
              OS
            </div>
            <span className="font-extrabold text-white text-base">OSAS Admin</span>
          </div>
          <nav className="space-y-1">
            <button className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl bg-emerald-600/10 text-emerald-400 font-bold text-sm text-left">
              <FontAwesomeIcon icon={["fas", "folder-open"]} />
              <span>Posts Manager</span>
            </button>
          </nav>
        </div>
        <button 
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-500/10 hover:text-red-400 text-slate-400 font-bold text-sm text-left transition-colors cursor-pointer"
        >
          <FontAwesomeIcon icon={["fas", "right-from-bracket"]} />
          <span>Sign Out</span>
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-6 md:p-10 max-h-screen overflow-y-auto">
        <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Posts Manager</h1>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">Manage School Announcements & Stories</p>
          </div>
          <button
            onClick={() => setIsCreating(!isCreating)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <FontAwesomeIcon icon={isCreating ? ["fas", "xmark"] : ["fas", "plus"]} />
            <span>{isCreating ? "Cancel" : "Create New Post"}</span>
          </button>
        </div>

        {isCreating ? (
          <form onSubmit={handleSavePost} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5 max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Title</label>
                <input 
                  type="text" required value={title} onChange={e => setTitle(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-700"
                  placeholder="Enter post title"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Type</label>
                <select 
                  value={type} onChange={e => setType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-700 bg-white"
                >
                  <option value="Announcement">Announcement</option>
                  <option value="Story">Story & Update</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Author</label>
                <input 
                  type="text" value={author} onChange={e => setAuthor(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-700"
                  placeholder="E.g., OSAS Office (Optional)"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-400 uppercase">Cover Image</label>
                <input 
                  type="file" accept="image/*" onChange={handleImageChange}
                  className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-400 uppercase">Article Content</label>
              <div className="rounded-xl border border-slate-200 bg-white">
                <ReactQuill 
                  theme="snow"
                  value={content}
                  onChange={setContent}
                  modules={quillModules}
                />
              </div>
            </div>

            <div className="pt-12 text-right">
              <button 
                type="submit"
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-8 py-3 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
              >
                {loading ? "Publishing to Cloud..." : "Publish Article"}
              </button>
            </div>
          </form>
        ) : (
          <div className="grid grid-cols-1 gap-4 max-w-5xl mx-auto">
            {posts.length === 0 ? (
              <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl">
                <FontAwesomeIcon icon={["fas", "folder-open"]} className="text-slate-300 w-12 h-12 mb-3" />
                <h3 className="font-bold text-slate-700 text-sm">No articles published yet</h3>
                <p className="text-xs text-slate-400 mt-1">Click the 'Create New' button in the header to publish an article.</p>
              </div>
            ) : (
              posts.map((post) => (
                <div key={post.id} className="bg-white border border-slate-200 rounded-2xl p-4 flex items-center justify-between gap-4 shadow-sm">
                  <div className="flex items-center gap-4">
                    {post.cover_image ? (
                      <img src={post.cover_image} alt="" className="w-16 h-16 rounded-xl object-cover bg-slate-100 flex-shrink-0" />
                    ) : (
                      <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-slate-300 text-sm font-bold uppercase flex-shrink-0">No Img</div>
                    )}
                    <div>
                      <span className="text-[9px] uppercase tracking-wider bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                        {post.type}
                      </span>
                      <h4 className="font-bold text-slate-800 text-sm mt-1 leading-snug">{post.title}</h4>
                      <p className="text-[10px] text-slate-400 font-medium mt-0.5">Published on: {post.date}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleDeletePost(post.id)}
                    className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline px-3 py-1 cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              ))
            )}
          </div>
        )}
      </main> 
    </div>
  );
}