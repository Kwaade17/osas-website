import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import ReactQuill, { Quill } from "react-quill-new"; 
import "react-quill-new/dist/quill.snow.css"; 
import ImageResize from "@mgreminger/quill-image-resize-module";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { supabase } from "../supabaseClient";

// 💡 NEW LIBRARIES: For reading zip files, compiling templates, and saving files!
import PizZip from "pizzip";
import Docxtemplater from "docxtemplater";
import { saveAs } from "file-saver";

Quill.register("modules/imageResize", ImageResize);

const quillModules = {
  toolbar: [
    [{ 'header': [1, 2, 3, false] }],
    ['bold', 'italic', 'underline', 'strike'],        
    [{'list': 'ordered'}, {'list': 'bullet'}],        
    [{ 'align': [] }],                                
    ['link', 'image'],                                
    ['clean']                                         
  ],
  imageResize: {}
};

const iconOptions = [
  { label: "File / Document", value: "fa-file" },
  { label: "Speech Message", value: "fa-message" },
  { label: "Medical Kit", value: "fa-kit-medical" },
  { label: "Graduation Cap", value: "fa-user-graduate" },
  { label: "School Book", value: "fa-book" },
  { label: "Security Shield", value: "fa-shield-halved" },
  { label: "Info Circle", value: "fa-circle-info" }
];

const formatBytes = (bytes) => {
  if (!bytes || bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("announcements"); // "announcements", "stories", "services", "calendar", "good_moral", "storage"
  const [posts, setPosts] = useState([]);
  const [activities, setActivities] = useState([]); 
  const [storageFiles, setStorageFiles] = useState([]);
  const [loadingStorage, setLoadingStorage] = useState(false);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingActivities, setLoadingActivities] = useState(false);

  // Good Moral State Variables
  const [goodMoralRequests, setGoodMoralRequests] = useState([]);
  const [loadingGM, setLoadingGM] = useState(false);

  // Form States (Announcements/Stories/Services)
  const [title, setTitle] = useState("");
  const [type, setType] = useState("Announcement");
  const [imageFile, setImageFile] = useState(null); 
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [isEditing, setIsEditing] = useState(false); 
  const [icon, setIcon] = useState("fa-file");
  const [description, setDescription] = useState("");
  const [editingPostId, setEditingPostId] = useState(null); 
  const [existingCoverImage, setExistingCoverImage] = useState(""); 
  const [isGalleryOpen, setIsGalleryOpen] = useState(false); 
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  // Calendar Form States
  const [eventTitle, setEventTitle] = useState("");
  const [eventDescription, setEventDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [eventLocation, setEventLocation] = useState("");
  const [editingActivityId, setEditingActivityId] = useState(null);
  const [eventEndDate, setEventEndDate] = useState(""); 
  const [eventOngoingUpdate, setEventOngoingUpdate] = useState("");
  const [isOneDayEvent, setIsOneDayEvent] = useState(true);

  // Good Moral Form States (Walk-In Uploader)
  const [gmName, setGMName] = useState("");
  const [gmType, setGMType] = useState("Undergraduate"); // 'Undergraduate' or 'Graduate'
  const [gmCourse, setGMCourse] = useState("");
  const [gmSchoolYear, setGMSchoolYear] = useState("");
  const [gmSemester, setGMSemester] = useState("1st"); // NULL for Graduate
  const [gmGradDate, setGMGradDate] = useState(""); // NULL for Undergraduate
  const [gmOrNumber, setGMOrNumber] = useState("");
  const [gmOrDate, setGMOrDate] = useState("");
  const [gmYearLevel, setGMYearLevel] = useState("1st"); // 💡 ADD THIS: '1st', '2nd', '3rd', '4th'

  // Printing & Modal States
  const [selectedGMForPrint, setSelectedGMForPrint] = useState(null);
  const [printMode, setPrintMode] = useState("overlay"); // "full" (plain paper) or "overlay" (pre-printed cardstock)
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchPosts();
    fetchActivities();
    fetchGoodMoralRequests();
    fetchStorageFiles();
  }, []);

  const fetchPosts = async () => {
    setLoadingPosts(true);
    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      alert("Error loading posts: " + error.message);
    } else {
      setPosts(data);
    }
    setLoadingPosts(false);
  };

  const fetchActivities = async () => {
    setLoadingActivities(true);
    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .order("activity_date", { ascending: true });

    if (error) {
      alert("Error loading activities: " + error.message);
    } else {
      setActivities(data);
    }
    setLoadingActivities(false);
  };

  // Fetch Good Moral requests from Supabase
  const fetchGoodMoralRequests = async () => {
    setLoadingGM(true);
    const { data, error } = await supabase
      .from("good_moral_requests")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) {
      setGoodMoralRequests(data);
    }
    setLoadingGM(false);
  };

  const fetchStorageFiles = async () => {
    setLoadingStorage(true);
    const { data, error } = await supabase.storage
      .from("osas-assets")
      .list("covers", {
        limit: 100,
        sortBy: { column: "created_at", order: "desc" }
      });

    if (error) {
      alert("Error loading storage: " + error.message);
    } else {
      const files = data.filter(file => file.name !== ".emptyFolderPlaceholder");
      setStorageFiles(files);
    }
    setLoadingStorage(false);
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file); 
      setExistingCoverImage(""); 
    }
  };

  const handleEditClick = (post) => {
    setEditingPostId(post.id);
    setTitle(post.title);
    setType(post.type);
    setContent(post.content);
    setAuthor(post.author);
    setExistingCoverImage(post.cover_image || "");
    setIcon(post.icon || "fa-file"); 
    setDescription(post.description || ""); 
    setImageFile(null); 
    setIsEditing(true);  
  };

  // Pre-populates the Calendar Form when clicking Edit on an event
  const handleEditActivityClick = (act) => {
    setEditingActivityId(act.id);
    setEventTitle(act.title);
    setEventDescription(act.description || "");
    setEventDate(act.activity_date);
    setEventTime(act.start_time || "");
    setEventLocation(act.location || "");
    setEventEndDate(act.end_date || "");
    setEventOngoingUpdate(act.ongoing_update || "");
    setIsOneDayEvent(!act.end_date || act.end_date === act.activity_date);
    setIsEditing(true); // Open form
  };

  const handleCreateClick = () => {
    setEditingPostId(null);
    setEditingActivityId(null); // Reset calendar edit state
    setTitle("");
    if (activeTab === "announcements") setType("Announcement");
    else if (activeTab === "stories") setType("Story");
    else if (activeTab === "services") setType("Service");
    
    setContent("");
    setAuthor("");
    setExistingCoverImage("");
    setIcon("fa-file"); 
    setDescription(""); 
    setImageFile(null);
    setIsEditing(!isEditing);

    setEventTitle("");
    setEventDescription("");
    setEventDate("");
    setEventTime("");
    setEventLocation("");
    setEventEndDate("");
    setEventOngoingUpdate("");
    setIsOneDayEvent(true);

    // Reset GM Form
    setGMName("");
    setGMType("Undergraduate");
    setGMCourse("");
    setGMSchoolYear("");
    setGMSemester("1st");
    setGMYearLevel("1st")
    setGMGradDate("");
    setGMOrNumber("");
    setGMOrDate("");
  };

  const handleSavePost = async (e) => {
    e.preventDefault();
    if (!title || !content) return;
    setLoading(true);

    let coverImageUrl = existingCoverImage; 

    if (imageFile && type !== "Service") {
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

      const { data: { publicUrl } } = supabase.storage
        .from("osas-assets")
        .getPublicUrl(filePath);

      coverImageUrl = publicUrl;
    }

    if (editingPostId) {
      // --- UPDATE EXISTING POST ---
      const { error: updateError } = await supabase
        .from("posts")
        .update({
          title,
          type,
          content,
          cover_image: type === "Service" ? null : coverImageUrl,
          author: author || "OSAS Admin",
          icon: type === "Service" ? icon : null,
          description: type === "Service" ? description : null
        })
        .eq("id", editingPostId);

      if (updateError) {
        alert("Failed to update: " + updateError.message);
      } else {
        setIsEditing(false);
        setEditingPostId(null);
        fetchPosts(); 
      }
    } else {
      // --- INSERT NEW POST ---
      const { error: insertError } = await supabase
        .from("posts")
        .insert([
          {
            title,
            type,
            content,
            cover_image: type === "Service" ? null : coverImageUrl,
            author: author || "OSAS Admin",
            date: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
            icon: type === "Service" ? icon : null,
            description: type === "Service" ? description : null
          }
        ]);

      if (insertError) {
        alert("Failed to publish: " + insertError.message);
      } else {
        setTitle("");
        setContent("");
        setImageFile(null);
        setAuthor("");
        setIcon("fa-file");
        setDescription("");
        setIsEditing(false); 
        fetchPosts();
      }
    }
    
    fetchStorageFiles();
    setLoading(false);
  };

  // INSERT / UPDATE: Academic Calendar Event
  const handleSaveActivity = async (e) => {
    e.preventDefault();
    if (!eventTitle || !eventDate) return;
    setLoading(true);

    const eventPayload = {
      title: eventTitle,
      description: eventDescription,
      activity_date: eventDate,
      start_time: eventTime.trim() || "TBA",
      location: eventLocation.trim() || "TBA",
      end_date: isOneDayEvent ? eventDate : (eventEndDate || eventDate),
      ongoing_update: eventOngoingUpdate.trim() || null
    };

    if (editingActivityId) {
      const { error } = await supabase
        .from("activities")
        .update(eventPayload)
        .eq("id", editingActivityId);

      if (error) {
        alert("Failed to update event: " + error.message);
      } else {
        setEditingActivityId(null);
        setIsEditing(false);
        fetchActivities();
      }
    } else {
      const { error } = await supabase
        .from("activities")
        .insert([eventPayload]);

      if (error) {
        alert("Failed to save activity: " + error.message);
      } else {
        setEventTitle("");
        setEventDescription("");
        setEventDate("");
        setEventEndDate("");
        setEventTime("");
        setEventLocation("");
        setEventOngoingUpdate("");
        setIsEditing(false);
        fetchActivities(); 
      }
    }
    setLoading(false);
  };

  // INSERT: Manual Counter/Walk-In Good Moral Request
  const handleSaveGoodMoral = async (e) => {
    e.preventDefault();
    if (!gmName || !gmCourse || !gmOrNumber || !gmOrDate) return;
    setLoading(true);

    const { error } = await supabase
      .from("good_moral_requests")
      .insert([
        {
          student_name: gmName.toUpperCase(), 
          student_type: gmType,
          course_major: gmCourse,
          school_year: gmSchoolYear,
          semester: gmType === "Undergraduate" ? gmSemester : null,
          year_level: gmType === "Undergraduate" ? gmYearLevel : null, // 💡 ADD THIS
          grad_date: gmType === "Graduate" ? gmGradDate : null,
          or_number: gmOrNumber,
          or_date: gmOrDate,
          source: "walk_in",
          status: "approved" 
        }
      ]);

    if (error) {
      alert("Failed to save request: " + error.message);
    } else {
      setGMName("");
      setGMCourse("");
      setGMSchoolYear("");
      setGMSemester("1st");
      setGMYearLevel("1st");
      setGMGradDate("");
      setGMOrNumber("");
      setGMOrDate("");
      setIsEditing(false);
      fetchGoodMoralRequests();
    }
    setLoading(false);
  };

  // UPDATE: Approve an online student request
  const handleApproveGMRequest = async (id) => {
    const { error } = await supabase
      .from("good_moral_requests")
      .update({ status: "approved" })
      .eq("id", id);

    if (error) {
      alert("Failed to approve: " + error.message);
    } else {
      fetchGoodMoralRequests();
    }
  };

  // UPDATE: Archive request status to "printed" once print finishes
  const handleMarkAsPrinted = async (id) => {
    await supabase
      .from("good_moral_requests")
      .update({ status: "printed" })
      .eq("id", id);
    fetchGoodMoralRequests();
  };

  const handleDeleteGMRequest = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this request?")) {
      await supabase.from("good_moral_requests").delete().eq("id", id);
      fetchGoodMoralRequests();
    }
  };

  const handleDeleteActivity = async (id) => {
    if (window.confirm("Are you sure you want to permanently delete this event?")) {
      const { error } = await supabase
        .from("activities")
        .delete()
        .eq("id", id);

      if (error) {
        alert("Failed to delete: " + error.message);
      } else {
        fetchActivities();
      }
    }
  };

  const handleDeletePost = async (id) => {
    if (window.confirm("Are you sure you want to delete this post? This cannot be undone.")) {
      const { error } = await supabase
        .from("posts")
        .delete()
        .eq("id", id);

      if (error) {
        alert("Delete failed: " + error.message);
      } else {
        fetchPosts(); 
      }
    }
  };

  const handleDeleteFile = async (fileName) => {
    if (window.confirm("Are you sure you want to permanently delete this image from your cloud storage? This cannot be undone.")) {
      const { error } = await supabase.storage
        .from("osas-assets")
        .remove([`covers/${fileName}`]);

      if (error) {
        alert("Delete failed: " + error.message);
      } else {
        fetchStorageFiles(); 
      }
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/login");
  };

  const getPublicImageUrl = (fileName) => {
    const { data: { publicUrl } } = supabase.storage
      .from("osas-assets")
      .getPublicUrl(`covers/${fileName}`);
    return publicUrl;
  };

  // 💡 NEW WORD-DOCUMENT GENERATOR (PizZip + Docxtemplater + FileSaver)
  const generateDocument = async (req, mode) => {
    setLoading(true);
    try {
      // 1. Choose the correct template file depending on Student Type (Undergrad vs Graduate) and Print Mode (Full vs Overlay)
      let templateName = "";
      if (req.student_type === "Graduate") {
        templateName = mode === "full" ? "Template_Good_Moral_Graduate_Full.docx" : "Template_Good_Moral_Graduate_Overlay.docx";
      } else {
        templateName = mode === "full" ? "Template_Good_Moral_Undergrad_Full.docx" : "Template_Good_Moral_Undergrad_Overlay.docx";
      }

      // 2. Fetch the template file from Vite's public/ folder as an array buffer
      const response = await fetch(`/${templateName}`);
      if (!response.ok) {
        throw new Error(`Failed to load template file: ${templateName}. Please ensure it is saved in your Vite public/ folder!`);
      }
      const arrayBuffer = await response.arrayBuffer();

      // 3. Load the zip archive using PizZip
      const zip = new PizZip(arrayBuffer);

      // 4. Initialize Docxtemplater
      const doc = new Docxtemplater(zip, {
        paragraphLoop: true,
        linebreaks: true,
      });

      const d = new Date(req.or_date + "T00:00:00"); 
      const mm = String(d.getMonth() + 1).padStart(2, "0");
      const dd = String(d.getDate()).padStart(2, "0");
      const yyyy = d.getFullYear();
      const formattedOrDate = `${mm}/${dd}/${yyyy}`;

      const getDaySuffix = (day) => {
        if (day > 3 && day < 21) return "th"; // Covers 4th to 20th
        switch (day % 10) {
          case 1: return "st";  // 1st, 21st, 31st
          case 2: return "nd";  // 2nd, 22nd
          case 3: return "rd";  // 3rd, 23rd
          default: return "th"; // 24th to 30th
        }
      };

      const currentDay = new Date().getDate();
      const currentDaySuffix = getDaySuffix(currentDay);
      const currentMonth = new Date().toLocaleDateString("en-US", { month: "long" });
      const currentYear = new Date().getFullYear();

      const yrNum = req.year_level ? req.year_level.charAt(0) : "";
      const yrSuffix = req.year_level ? req.year_level.slice(1) : "";

      const semNum = req.semester ? req.semester.charAt(0) : "";
      const semSuffix = req.semester ? req.semester.slice(1) : "";

      // 5. Map your exact Supabase variables to the Word placeholder tags!
      doc.render({
        student_name: req.student_name,
        course_major: req.course_major,
        school_year: req.school_year,
        yr_num: yrNum,
        yr_suffix: yrSuffix,
        sem_num: semNum,
        sem_suffix: semSuffix,
        semester: req.semester || "",
        year_level: req.year_level || "", 
        grad_date: req.grad_date || "",
        or_number: req.or_number,
        or_date: formattedOrDate,
        day_num: currentDay,
        day_suffix: currentDaySuffix,
        issue_month: currentMonth,
        issue_year: currentYear,
      });

      // 6. Generate the completed document blob
      const out = doc.getZip().generate({
        type: "blob",
        mimeType: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      });

      // 7. Trigger the automatic download!
      const outputFilename = `GMC_${mode.toUpperCase()}_${req.student_type.toUpperCase()}_${req.student_name.replace(/[^a-zA-Z0-9]/g, "_")}.docx`;
      saveAs(out, outputFilename);

      // 8. Update request status to "printed" on Supabase & Close Modal
      await handleMarkAsPrinted(req.id);
      setIsPrintModalOpen(false);
      setSelectedGMForPrint(null);

    } catch (err) {
      alert("Document Generation Failed: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Triggering the Print Preview Modal
  const handlePrintTrigger = (req) => {
    setSelectedGMForPrint(req);
    setIsPrintModalOpen(true); 
  };

  const announcementsList = posts.filter(p => p.type === "Announcement");
  const storiesList = posts.filter(p => p.type === "Story");
  const servicesList = posts.filter(p => p.type === "Service"); 

  const pendingGMList = goodMoralRequests.filter(r => r.status === "pending");
  const approvedGMList = goodMoralRequests.filter(r => r.status === "approved" || r.status === "printed");

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row relative">
      
      {/* MOBILE TOP BAR */}
      <header className="md:hidden w-full bg-slate-900 text-slate-200 px-6 py-4 flex items-center justify-between shadow-md border-b border-slate-800 flex-shrink-0 z-30">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">OS</div>
          <span className="font-extrabold text-white text-base">OSAS Admin</span>
        </div>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-400 hover:bg-slate-800 rounded-xl transition-colors cursor-pointer">
          <FontAwesomeIcon icon={isMobileMenuOpen ? ["fas", "xmark"] : ["fas", "bars"]} className="w-5 h-5" />
        </button>
      </header>

      {/* MOBILE DRAWER SIDEBAR */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 md:hidden animate-in fade-in duration-200">
          <div className="w-64 h-full bg-slate-900 text-slate-200 p-6 flex flex-col justify-between shadow-2xl animate-in slide-in-from-left duration-300">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">OS</div>
                  <span className="font-extrabold text-white text-base">OSAS Admin</span>
                </div>
                <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-slate-400 hover:bg-slate-800 rounded-xl cursor-pointer">
                  <FontAwesomeIcon icon={["fas", "xmark"]} className="w-5 h-5" />
                </button>
              </div>
              <nav className="space-y-1">
                <button onClick={() => { setActiveTab("announcements"); setIsEditing(false); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm text-left ${activeTab === "announcements" ? "bg-emerald-600/10 text-emerald-400" : "text-slate-400"}`}><FontAwesomeIcon icon={["fas", "bullhorn"]} /><span>Announcements</span></button>
                <button onClick={() => { setActiveTab("stories"); setIsEditing(false); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm text-left ${activeTab === "stories" ? "bg-emerald-600/10 text-emerald-400" : "text-slate-400"}`}><FontAwesomeIcon icon={["fas", "book-open"]} /><span>Stories & Updates</span></button>
                <button onClick={() => { setActiveTab("services"); setIsEditing(false); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm text-left ${activeTab === "services" ? "bg-emerald-600/10 text-emerald-400" : "text-slate-400"}`}><FontAwesomeIcon icon={["fas", "kit-medical"]} /><span>Services Offer</span></button>
                <button onClick={() => { setActiveTab("calendar"); setIsEditing(false); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm text-left ${activeTab === "calendar" ? "bg-emerald-600/10 text-emerald-400" : "text-slate-400"}`}><FontAwesomeIcon icon={["fas", "calendar-days"]} /><span>Academic Calendar</span></button>
                <button onClick={() => { setActiveTab("good_moral"); setIsEditing(false); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm text-left ${activeTab === "good_moral" ? "bg-emerald-600/10 text-emerald-400" : "text-slate-400"}`}><FontAwesomeIcon icon={["fas", "certificate"]} /><span>Good Moral Portal</span></button>
                <button onClick={() => { setActiveTab("storage"); setIsEditing(false); setIsMobileMenuOpen(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm text-left ${activeTab === "storage" ? "bg-emerald-600/10 text-emerald-400" : "text-slate-400"}`}><FontAwesomeIcon icon={["fas", "images"]} /><span>Cloud Storage</span></button>
              </nav>
            </div>
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-500/10 hover:text-red-400 text-slate-400 font-bold text-sm text-left"><FontAwesomeIcon icon={["fas", "right-from-bracket"]} /><span>Sign Out</span></button>
          </div>
        </div>
      )}

      {/* DESKTOP SIDEBAR */}
      <aside className="w-64 bg-slate-900 text-slate-200 p-6 flex flex-col justify-between hidden md:flex flex-shrink-0">
        <div className="space-y-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold text-sm">OS</div>
            <span className="font-extrabold text-white text-base">OSAS Admin</span>
          </div>
          <nav className="space-y-1">
            <button onClick={() => { setActiveTab("announcements"); setIsEditing(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm text-left transition-colors cursor-pointer ${activeTab === "announcements" ? "bg-emerald-600/10 text-emerald-400" : "hover:bg-slate-800 text-slate-400"}`}><FontAwesomeIcon icon={["fas", "bullhorn"]} /><span>Announcements</span></button>
            <button onClick={() => { setActiveTab("stories"); setIsEditing(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm text-left transition-colors cursor-pointer ${activeTab === "stories" ? "bg-emerald-600/10 text-emerald-400" : "hover:bg-slate-800 text-slate-400"}`}><FontAwesomeIcon icon={["fas", "book-open"]} /><span>Stories & Updates</span></button>
            <button onClick={() => { setActiveTab("services"); setIsEditing(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm text-left transition-colors cursor-pointer ${activeTab === "services" ? "bg-emerald-600/10 text-emerald-400" : "hover:bg-slate-800 text-slate-400"}`}><FontAwesomeIcon icon={["fas", "kit-medical"]} /><span>Services Offer</span></button>
            <button onClick={() => { setActiveTab("calendar"); setIsEditing(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm text-left transition-colors cursor-pointer ${activeTab === "calendar" ? "bg-emerald-600/10 text-emerald-400" : "hover:bg-slate-800 text-slate-400"}`}><FontAwesomeIcon icon={["fas", "calendar-days"]} /><span>Academic Calendar</span></button>
            <button onClick={() => { setActiveTab("good_moral"); setIsEditing(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm text-left transition-colors cursor-pointer ${activeTab === "good_moral" ? "bg-emerald-600/10 text-emerald-400" : "hover:bg-slate-800 text-slate-400"}`}><FontAwesomeIcon icon={["fas", "certificate"]} /><span>Good Moral Portal</span></button>
            <button onClick={() => { setActiveTab("storage"); setIsEditing(false); }} className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl font-bold text-sm text-left transition-colors cursor-pointer ${activeTab === "storage" ? "bg-emerald-600/10 text-emerald-400" : "hover:bg-slate-800 text-slate-400"}`}><FontAwesomeIcon icon={["fas", "images"]} /><span>Cloud Storage</span></button>
          </nav>
        </div>
        <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl hover:bg-red-500/10 hover:text-red-400 text-slate-400 font-bold text-sm text-left transition-colors"><FontAwesomeIcon icon={["fas", "right-from-bracket"]} /><span>Sign Out</span></button>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-h-screen overflow-y-auto">
        
        {/* VIEW 1 & 2 & 3: GENERAL POSTS (Announcements, Stories, Services) */}
        {activeTab !== "storage" && activeTab !== "calendar" && activeTab !== "good_moral" && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
              <div>
                <h1 className="text-2xl font-black text-slate-800 uppercase tracking-wide">
                  {activeTab === "announcements" ? "Announcements Manager" : activeTab === "stories" ? "Stories Manager" : "Services Manager"}
                </h1>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">
                  {activeTab === "announcements" ? "Manage School Announcements" : activeTab === "stories" ? "Manage Campus Logs" : "Manage Interactive Service Cards"}
                </p>
              </div>
              <button
                onClick={handleCreateClick}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <FontAwesomeIcon icon={isEditing ? ["fas", "xmark"] : ["fas", "plus"]} />
                <span>{isEditing ? "Cancel" : "Create New"}</span>
              </button>
            </div>

            {isEditing ? (
              <form onSubmit={handleSavePost} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5 max-w-4xl mx-auto">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Title / Service Name</label>
                  <input 
                    type="text" required value={title} onChange={e => setTitle(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-700"
                    placeholder="Enter post title"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase">Author / Section</label>
                    <input 
                      type="text" value={author} onChange={e => setAuthor(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-700"
                      placeholder="E.g., OSAS Office (Optional)"
                    />
                  </div>
                  
                  {type !== "Service" && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold text-slate-400 uppercase">Cover Image</label>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input 
                          type="file" accept="image/*" onChange={handleImageChange}
                          className="w-full px-4 py-2 rounded-xl border border-slate-200 text-xs font-semibold text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100"
                        />
                        <button
                          type="button"
                          onClick={() => setIsGalleryOpen(true)}
                          className="px-4 py-2 rounded-xl border border-emerald-600/30 text-emerald-800 hover:bg-emerald-50 font-bold text-xs flex-shrink-0 cursor-pointer"
                        >
                          Browse Storage
                        </button>
                      </div>
                      {(imageFile || existingCoverImage) && (
                        <div className="flex items-center gap-2.5 mt-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/50">
                          <img src={imageFile ? URL.createObjectURL(imageFile) : existingCoverImage} alt="" className="w-12 h-12 rounded-lg object-cover bg-slate-200" />
                          <div className="min-w-0 pr-8 relative flex-1">
                            <p className="text-xs font-bold text-slate-700 truncate">{imageFile ? imageFile.name : "Stored Cover Photo"}</p>
                            <button onClick={() => { setImageFile(null); setExistingCoverImage(""); }} className="absolute right-0 top-1/2 -translate-y-1/2 text-red-500 p-2 cursor-pointer"><FontAwesomeIcon icon={["fas", "trash"]} className="w-3.5 h-3.5" /></button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  {type === "Service" && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 col-span-2 animate-in fade-in duration-300">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase">Select Card Icon</label>
                        <select 
                          value={icon} onChange={e => setIcon(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-700 bg-white"
                        >
                          {iconOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-400 uppercase">Short Card Description</label>
                        <input 
                          type="text" required value={description} onChange={e => setDescription(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-700"
                          placeholder="Short summary shown on the home page card"
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase">Detailed Service Content (Quill Editor)</label>
                  <div className="rounded-xl border border-slate-200 bg-white">
                    <ReactQuill theme="snow" value={content} onChange={setContent} modules={quillModules} />
                  </div>
                </div>

                <div className="pt-12 text-right">
                  <button 
                    type="submit" disabled={loading}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-8 py-3 rounded-xl shadow-xs transition-colors cursor-pointer disabled:opacity-50"
                  >
                    {loading ? "Saving to Cloud..." : editingPostId ? "Update Item" : "Publish Item"}
                  </button>
                </div>
              </form>
            ) : (
              /* LIST MANAGER */
              <div className="grid grid-cols-1 gap-4 max-w-5xl mx-auto animate-in fade-in duration-300">
                {/* Announcements List */}
                {activeTab === "announcements" && (
                  announcementsList.length === 0 ? (
                    <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl">
                      <FontAwesomeIcon icon={["fas", "bullhorn"]} className="text-slate-300 w-12 h-12 mb-3 animate-bounce" />
                      <h3 className="font-bold text-slate-700 text-sm">No announcements published yet</h3>
                      <p className="text-xs text-slate-400 mt-1">Click the 'Create New' button in the header to publish an announcement.</p>
                    </div>
                  ) : (
                    announcementsList.map((post) => (
                      <div key={post.id} className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-slate-300 transition-colors">
                        <div className="flex items-center gap-4 text-left">
                          {post.cover_image ? <img src={post.cover_image} alt="" className="w-16 h-16 rounded-xl object-cover bg-slate-100 flex-shrink-0" /> : <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-slate-300 text-xs font-bold uppercase flex-shrink-0">No Img</div>}
                          <div className="min-w-0">
                            <span className="text-[9px] uppercase tracking-wider bg-emerald-50 text-emerald-800 font-bold px-2 py-0.5 rounded-full">Announcement</span>
                            <h4 className="font-bold text-slate-800 text-sm mt-1 leading-snug">{post.title}</h4>
                            <p className="text-[10px] text-slate-400 font-semibold mt-1">Published: {post.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-3 sm:pt-0 border-t border-slate-100 sm:border-0">
                          <button onClick={() => handleEditClick(post)} className="text-xs font-bold text-emerald-600 hover:text-emerald-800 hover:underline px-4 py-1.5 bg-emerald-50 sm:bg-transparent rounded-lg sm:rounded-none cursor-pointer">Edit</button>
                          <button onClick={() => handleDeletePost(post.id)} className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline px-4 py-1.5 bg-red-50 sm:bg-transparent rounded-lg sm:rounded-none cursor-pointer">Delete</button>
                        </div>
                      </div>
                    ))
                  )
                )}

                {/* Stories List */}
                {activeTab === "stories" && (
                  storiesList.length === 0 ? (
                    <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl">
                      <FontAwesomeIcon icon={["fas", "book-open"]} className="text-slate-300 w-12 h-12 mb-3 animate-bounce" />
                      <h3 className="font-bold text-slate-700 text-sm">No campus stories published yet</h3>
                      <p className="text-xs text-slate-400 mt-1">Click the 'Create New' button in the header to publish a story.</p>
                    </div>
                  ) : (
                    storiesList.map((post) => (
                      <div key={post.id} className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-slate-300 transition-colors">
                        <div className="flex items-center gap-4 text-left">
                          {post.cover_image ? <img src={post.cover_image} alt="" className="w-16 h-16 rounded-xl object-cover bg-slate-100 flex-shrink-0" /> : <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center text-slate-300 text-xs font-bold uppercase flex-shrink-0">No Img</div>}
                          <div className="min-w-0">
                            <h4 className="font-bold text-slate-800 text-sm mt-1 leading-snug">{post.title}</h4>
                            <p className="text-[10px] text-slate-400 font-semibold mt-1">Published: {post.date}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-3 sm:pt-0 border-t border-slate-100 sm:border-0">
                          <button onClick={() => handleEditClick(post)} className="text-xs font-bold text-emerald-600 hover:text-emerald-800 hover:underline px-4 py-1.5 bg-emerald-50 sm:bg-transparent rounded-lg sm:rounded-none cursor-pointer">Edit</button>
                          <button onClick={() => handleDeletePost(post.id)} className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline px-4 py-1.5 bg-red-50 sm:bg-transparent rounded-lg sm:rounded-none cursor-pointer">Delete</button>
                        </div>
                      </div>
                    ))
                  )
                )}

                {/* Services List */}
                {activeTab === "services" && (
                  servicesList.length === 0 ? (
                    <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl">
                      <FontAwesomeIcon icon={["fas", "kit-medical"]} className="text-slate-300 w-12 h-12 mb-3 animate-bounce" />
                      <h3 className="font-bold text-slate-700 text-sm">No services published yet</h3>
                      <p className="text-xs text-slate-400 mt-1">Click the 'Create New' button in the header to publish a service.</p>
                    </div>
                  ) : (
                    servicesList.map((post) => (
                      <div key={post.id} className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-slate-300 transition-colors">
                        <div className="flex items-center gap-4 text-left">
                          <div className="w-16 h-16 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-lg flex-shrink-0 border border-emerald-100">
                            <FontAwesomeIcon icon={["fas", (post.icon || "file").replace("fa-", "")]} />
                          </div>
                          <div className="min-w-0">
                            <span className="text-[9px] uppercase tracking-wider bg-blue-50 text-blue-800 font-bold px-2 py-0.5 rounded-full">Service</span>
                            <h4 className="font-bold text-slate-800 text-sm mt-1 leading-snug">{post.title}</h4>
                            <p className="text-[10px] text-slate-400 font-semibold mt-1">Summary: {post.description}</p>
                          </div>
                        </div>
                        <div className="flex items-center justify-end gap-3 pt-3 sm:pt-0 border-t border-slate-100 sm:border-0">
                          <button onClick={() => handleEditClick(post)} className="text-xs font-bold text-emerald-600 hover:text-emerald-800 hover:underline px-4 py-1.5 bg-emerald-50 sm:bg-transparent rounded-lg sm:rounded-none cursor-pointer">Edit</button>
                          <button onClick={() => handleDeletePost(post.id)} className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline px-4 py-1.5 bg-red-50 sm:bg-transparent rounded-lg sm:rounded-none cursor-pointer">Delete</button>
                        </div>
                      </div>
                    ))
                  )
                )}
              </div>
            )}
          </>
        )}

        {/* --- VIEW 4: ACADEMIC CALENDAR MANAGER --- */}
        {activeTab === "calendar" && (
          <>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
              <div>
                <h1 className="text-2xl font-black text-slate-800 uppercase tracking-wide">Academic Calendar</h1>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Manage Calendar of Activities & Countdown Events</p>
              </div>
              <button
                onClick={handleCreateClick}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <FontAwesomeIcon icon={isEditing ? ["fas", "xmark"] : ["fas", "plus"]} />
                <span>{isEditing ? "Cancel" : "Create New Event"}</span>
              </button>
            </div>

            {isEditing ? (
              /* CALENDAR EVENT CREATION FORM */
              <form onSubmit={handleSaveActivity} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5 max-w-4xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase">Event Title</label>
                    <input 
                      type="text" required value={eventTitle} onChange={e => setEventTitle(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-700"
                      placeholder="E.g., Good Moral Clearance Deadline"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase">Event Date</label>
                    <input 
                      type="date" required value={eventDate} onChange={e => setEventDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-700 bg-white"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase">Start Time</label>
                    <input 
                      type="text" value={eventTime} onChange={e => setEventTime(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-700"
                      placeholder="E.g., 8:00 AM or Whole Day (Optional)"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-400 uppercase">Event Location</label>
                    <input 
                      type="text" value={eventLocation} onChange={e => setEventLocation(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-700"
                      placeholder="E.g., OSAS Office, Ground Floor"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-400 uppercase">Event Description / Guidelines</label>
                  <textarea 
                    value={eventDescription} onChange={e => setEventDescription(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-700"
                    placeholder="Provide short processing guidelines or event details for students..."
                  />
                </div>

                <div className="pt-6 text-right">
                  <button 
                    type="submit" disabled={loading}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-8 py-3 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    {loading ? "Saving Event..." : editingActivityId ? "Update Event" : "Publish Event to Calendar"}
                  </button>
                </div>
              </form>
            ) : (
              /* CALENDAR EVENTS LIST */
              loadingActivities ? (
                <div className="flex justify-center items-center py-32">
                  <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-4 max-w-5xl mx-auto">
                  {activities.length === 0 ? (
                    <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl">
                      <FontAwesomeIcon icon={["fas", "calendar-days"]} className="text-slate-300 w-12 h-12 mb-3" />
                      <h3 className="font-bold text-slate-700 text-sm">No events scheduled yet</h3>
                      <p className="text-xs text-slate-400 mt-1">Click the 'Create New' button in the header to schedule an activity.</p>
                    </div>
                  ) : (
                    activities.map((act) => {
                      const formattedDate = new Date(act.activity_date).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
                      return (
                        <div key={act.id} className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-slate-300 transition-colors">
                          <div className="flex items-center gap-4 text-left">
                            <div className="w-16 h-16 rounded-xl bg-emerald-50 text-emerald-700 flex flex-col items-center justify-center text-sm font-bold flex-shrink-0 border border-emerald-100">
                              <FontAwesomeIcon icon={["fas", "calendar-day"]} className="w-5 h-5" />
                            </div>
                            <div className="min-w-0">
                              <h4 className="font-bold text-slate-800 text-sm leading-snug">{act.title}</h4>
                              <p className="text-[10px] text-slate-400 font-semibold mt-1">Date: {formattedDate} | Time: {act.start_time} | Location: {act.location}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-end gap-3 pt-3 sm:pt-0 border-t border-slate-100 sm:border-0">
                            <button onClick={() => handleEditActivityClick(act)} className="text-xs font-bold text-emerald-600 hover:text-emerald-800 hover:underline px-4 py-1.5 bg-emerald-50 sm:bg-transparent rounded-lg sm:rounded-none cursor-pointer">Edit</button>
                            <button onClick={() => handleDeleteActivity(act.id)} className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline px-4 py-1.5 bg-red-50 sm:bg-transparent rounded-lg sm:rounded-none cursor-pointer">Delete</button>
                          </div>
                        </div>
                      )
                    })
                  )}
                </div>
              )
            )}
          </>
        )}

        {/* --- VIEW 5: GOOD MORAL PORTAL --- */}
        {activeTab === "good_moral" && (
          <>
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-slate-200">
              <div>
                <h1 className="text-2xl font-black text-slate-800 uppercase tracking-wide">Good Moral Portal</h1>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Manage Online Student Requests & Walk-In Issuances</p>
              </div>
              <button
                onClick={handleCreateClick}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer self-start sm:self-auto"
              >
                <FontAwesomeIcon icon={isEditing ? ["fas", "xmark"] : ["fas", "plus"]} />
                <span>{isEditing ? "Cancel" : "New Walk-In Request"}</span>
              </button>
            </div>

            {isEditing ? (
              /* --- WALK-IN STUDENT ENTRY FORM (UPDATED WITH YEAR LEVEL) --- */
              <form onSubmit={handleSaveGoodMoral} className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-5 max-w-4xl mx-auto animate-in fade-in duration-300">
                
                {/* Name & Student Type */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Student Full Name</label>
                    <input 
                      type="text" required value={gmName} onChange={e => setGMName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-700 uppercase"
                      placeholder="SURNAME, FIRST NAME, MIDDLE INITIAL"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Student Type</label>
                    <select 
                      value={gmType} onChange={e => setGMType(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-700 bg-white"
                    >
                      <option value="Undergraduate">Undergraduate Student</option>
                      <option value="Graduate">Graduate Student</option>
                    </select>
                  </div>
                </div>

                {/* Course & School Year */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Course / Major / Degree</label>
                    <input 
                      type="text" required value={gmCourse} onChange={e => setGMCourse(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-700"
                      placeholder="E.g., B.S.B.A. - FM or M.P.A."
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">School Year</label>
                    <input 
                      type="text" required value={gmSchoolYear} onChange={e => setGMSchoolYear(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-700"
                      placeholder="E.g., 2025 - 2026"
                    />
                  </div>
                </div>

                {/* DYNAMIC ROW: Spits Year Level & Semester side-by-side for Undergrads, shows Grad Date for Graduates */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {gmType === "Undergraduate" ? (
                    <>
                      <div className="space-y-1 animate-in fade-in duration-300">
                        <label className="text-xs font-bold text-slate-500 uppercase">Year Level</label>
                        <select 
                          value={gmYearLevel} onChange={e => setGMYearLevel(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-700 bg-white"
                        >
                          <option value="1st">1st</option>
                          <option value="2nd">2nd</option>
                          <option value="3rd">3rd</option>
                          <option value="4th">4th</option>
                        </select>
                      </div>
                      <div className="space-y-1 animate-in fade-in duration-300">
                        <label className="text-xs font-bold text-slate-500 uppercase">Semester</label>
                        <select 
                          value={gmSemester} onChange={e => setGMSemester(e.target.value)}
                          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-700 bg-white"
                        >
                          <option value="1st">1st</option>
                          <option value="2nd">2nd</option>
                          <option value="Summer">Summer</option>
                        </select>
                      </div>
                    </>
                  ) : (
                    <div className="space-y-1 animate-in fade-in duration-300">
                      <label className="text-xs font-bold text-slate-400">Graduation Date</label>
                      <input 
                        type="text" required value={gmGradDate} onChange={e => setGMGradDate(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500" 
                        placeholder="E.g., March 17, 2017"
                      />
                    </div>
                  )}
                </div>

                {/* O.R. Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">O.R. Number</label>
                    <input 
                      type="text" required value={gmOrNumber} onChange={e => setGMOrNumber(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-700"
                      placeholder="E.g., 8720792"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-slate-500 uppercase">Date of Payment</label>
                    <input 
                      type="date" required value={gmOrDate} onChange={e => setGMOrDate(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-700 bg-white"
                    />
                  </div>
                </div>

                <div className="pt-6 text-right">
                  <button 
                    type="submit" disabled={loading}
                    className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-8 py-3 rounded-xl shadow-xs transition-colors cursor-pointer"
                  >
                    {loading ? "Saving..." : "Add Walk-In Request"}
                  </button>
                </div>
              </form>
            ) : (
              /* --- THE QUEUE & HISTORY LISTS --- */
              <div className="space-y-8 max-w-5xl mx-auto animate-in fade-in duration-300">
                
                {/* Section A: Pending Online Requests */}
                <div className="space-y-3">
                  <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2 px-1">
                    <FontAwesomeIcon icon={["fas", "globe"]} className="text-emerald-600" />
                    <span>Pending Online Requests Queue ({pendingGMList.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {pendingGMList.length === 0 ? (
                      <div className="text-center py-10 bg-white border border-slate-200 rounded-3xl">
                        <p className="text-xs text-slate-400 font-semibold">No pending online requests currently</p>
                      </div>
                    ) : (
                      pendingGMList.map((req) => (
                        <div key={req.id} className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-slate-300 transition-all">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className="text-[9px] uppercase tracking-wider bg-orange-50 text-orange-800 font-bold px-2 py-0.5 rounded-full">Pending Online</span>
                              <span className="text-[10px] text-slate-400 font-bold">O.R: {req.or_number} | Date: {req.or_date}</span>
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm leading-snug">{req.student_name}</h4>
                            <p className="text-xs text-slate-500 font-semibold">{req.course_major} | School Year: {req.school_year} {req.semester ? `| ${req.semester} Sem` : ""}</p>
                          </div>
                          <div className="flex items-center justify-end gap-3 pt-3 sm:pt-0 border-t border-slate-100 sm:border-0">
                            <button onClick={() => handleApproveGMRequest(req.id)} className="text-xs font-bold text-emerald-600 hover:text-emerald-800 hover:underline px-4 py-1.5 bg-emerald-50 rounded-lg cursor-pointer">Verify & Approve</button>
                            <button onClick={() => handleDeleteGMRequest(req.id)} className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline px-4 py-1.5 bg-red-50 rounded-lg cursor-pointer">Delete</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

                {/* Section B: Approved / Ready to Print Log */}
                <div className="space-y-3">
                  <h3 className="font-extrabold text-slate-800 text-base flex items-center gap-2 px-1">
                    <FontAwesomeIcon icon={["fas", "print"]} className="text-slate-500" />
                    <span>Verified & Ready to Print History ({approvedGMList.length})</span>
                  </h3>
                  <div className="grid grid-cols-1 gap-4">
                    {approvedGMList.length === 0 ? (
                      <div className="text-center py-10 bg-white border border-slate-200 rounded-3xl">
                        <p className="text-xs text-slate-400 font-semibold">No approved requests ready for printing</p>
                      </div>
                    ) : (
                      approvedGMList.map((req) => (
                        <div key={req.id} className="bg-white border border-slate-200 rounded-2xl p-4 md:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-sm hover:border-slate-300 transition-all">
                          <div className="space-y-1.5">
                            <div className="flex items-center gap-2">
                              <span className={`text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full ${
                                req.status === "printed" ? "bg-slate-100 text-slate-700" : "bg-emerald-50 text-emerald-800"
                              }`}>
                                {req.status === "printed" ? "Printed / Archived" : "Approved"}
                              </span>
                              <span className="text-[10px] text-slate-400 font-bold">Source: {req.source === "walk_in" ? "Walk-In" : "Online"} | O.R: {req.or_number}</span>
                            </div>
                            <h4 className="font-bold text-slate-800 text-sm leading-snug">{req.student_name}</h4>
                            <p className="text-xs text-slate-500 font-semibold">{req.course_major} | SY: {req.school_year} {req.semester ? `| ${req.semester} Sem` : ""}</p>
                          </div>
                          <div className="flex items-center justify-end gap-3 pt-3 sm:pt-0 border-t border-slate-100 sm:border-0">
                            <button onClick={() => handlePrintTrigger(req)} className="text-xs font-bold text-emerald-600 hover:text-emerald-800 hover:underline px-4 py-1.5 bg-emerald-50 rounded-lg cursor-pointer">Print Certificate</button>
                            <button onClick={() => handleDeleteGMRequest(req.id)} className="text-xs font-bold text-red-500 hover:text-red-700 hover:underline px-4 py-1.5 bg-red-50 rounded-lg cursor-pointer">Delete</button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>
            )}
          </>
        )}

        {/* --- VIEW 5: CLOUD STORAGE --- */}
        {activeTab === "storage" && (
          <>
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-slate-200">
              <div>
                <h1 className="text-2xl font-black text-slate-800">Cloud Storage</h1>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Manage Assets in 'osas-assets' Bucket</p>
              </div>
              <button
                onClick={fetchStorageFiles}
                className="bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm px-4 py-2.5 rounded-xl border border-slate-200 flex items-center gap-2 cursor-pointer transition-colors"
              >
                <FontAwesomeIcon icon={["fas", "rotate"]} className={loadingStorage ? "animate-spin" : ""} />
                <span>Refresh Storage</span>
              </button>
            </div>

            {loadingStorage ? (
              <div className="flex justify-center items-center py-32">
                <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
              </div>
            ) : storageFiles.length === 0 ? (
              <div className="text-center py-20 bg-white border border-slate-200 rounded-3xl max-w-5xl mx-auto">
                <FontAwesomeIcon icon={["fas", "images"]} className="text-slate-300 w-12 h-12 mb-3" />
                <h3 className="font-bold text-slate-700 text-sm">No assets uploaded yet</h3>
                <p className="text-xs text-slate-400 mt-1">Uploaded cover photos will appear here automatically.</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 max-w-5xl mx-auto">
                {storageFiles.map((file) => {
                  const fileUrl = getPublicImageUrl(file.name);
                  const formattedSize = formatBytes(file.metadata?.size);
                  const uploadedDate = new Date(file.created_at).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });

                  return (
                    <div key={file.id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-300 flex flex-col justify-between group">
                      <div className="w-full h-36 bg-slate-100 overflow-hidden relative">
                        <img 
                          src={fileUrl} 
                          alt="" 
                          className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" 
                        />
                      </div>
                      <div className="p-4 flex flex-col flex-1 justify-between space-y-3">
                        <div className="space-y-0.5">
                          <h4 className="font-bold text-slate-800 text-xs truncate" title={file.name}>
                            {file.name}
                          </h4>
                          <div className="flex items-center justify-between text-[10px] font-semibold text-slate-400">
                            <span>{formattedSize}</span>
                            <span>•</span>
                            <span>{uploadedDate}</span>
                          </div>
                        </div>
                        <button
                          onClick={() => handleDeleteFile(file.name)}
                          className="w-full py-1.5 rounded-lg border border-red-100 hover:bg-red-50 text-red-500 hover:text-red-700 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <FontAwesomeIcon icon={["fas", "trash"]} className="w-3 h-3" />
                          <span>Delete Image</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}

      </main> 

      {/* --- REUSABLE CLOUD GALLERY MODAL OVERLAY --- */}
      {isGalleryOpen && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-4xl max-h-[85vh] flex flex-col p-6 shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="font-black text-slate-800 text-lg">Cloud Gallery</h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Select a previously uploaded cover photo</p>
              </div>
              <button 
                onClick={() => setIsGalleryOpen(false)}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={["fas", "xmark"]} className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Grid of Images */}
            <div className="flex-1 overflow-y-auto py-6">
              {storageFiles.length === 0 ? (
                <div className="text-center py-20">
                  <FontAwesomeIcon icon={["fas", "images"]} className="text-slate-200 w-12 h-12 mb-3" />
                  <h4 className="font-bold text-slate-400 text-sm">No assets found in your cloud storage</h4>
                  <p className="text-xs text-slate-400 mt-1">Upload a cover image first to populate the gallery.</p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {storageFiles.map((file) => {
                    const url = getPublicImageUrl(file.name);
                    return (
                      <div 
                        key={file.id}
                        onClick={() => {
                          setExistingCoverImage(url); // Assign selected image URL
                          setImageFile(null); // Clear new file uploader
                          setIsGalleryOpen(false); // Close Modal
                        }}
                        className="group border border-slate-200 rounded-2xl overflow-hidden cursor-pointer hover:border-emerald-500 hover:shadow-md transition-all duration-300 relative bg-slate-50 h-32 select-none"
                      >
                        <img src={url} alt="" className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-500" />
                        <div className="absolute inset-0 bg-emerald-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-emerald-600 text-white text-[10px] font-bold px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-md">Select Image</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

          </div>
        </div>
      )}

      {/* --- 💡 THE NEW DYNAMIC DOCX GENERATOR MODAL OVERLAY --- */}
      {isPrintModalOpen && selectedGMForPrint && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
          <div className="bg-white border border-slate-200 rounded-3xl w-full max-w-xl flex flex-col p-6 shadow-2xl space-y-6">
            
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="font-black text-slate-800 text-lg">Generate Good Moral</h3>
                <p className="text-xs text-slate-400 font-semibold mt-0.5">Configure template type and download</p>
              </div>
              <button 
                type="button"
                onClick={() => { setIsPrintModalOpen(false); setSelectedGMForPrint(null); }}
                className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={["fas", "xmark"]} className="w-5 h-5" />
              </button>
            </div>

            {/* Toggle buttons for Template Mode */}
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPrintMode("full")}
                className={`p-4 rounded-2xl border text-center cursor-pointer transition-all ${
                  printMode === "full" 
                    ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm" 
                    : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                }`}
              >
                <FontAwesomeIcon icon={["fas", "file-signature"]} className="w-5 h-5 mb-1.5 mx-auto block" />
                <span className="font-bold text-xs">Full Certificate (.docx)</span>
                <span className="block text-[10px] text-slate-400/80 mt-1 font-medium">For plain white papers</span>
              </button>
              <button
                type="button"
                onClick={() => setPrintMode("overlay")}
                className={`p-4 rounded-2xl border text-center cursor-pointer transition-all ${
                  printMode === "overlay" 
                    ? "bg-emerald-50 border-emerald-500 text-emerald-800 shadow-sm" 
                    : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-slate-100"
                }`}
              >
                <FontAwesomeIcon icon={["fas", "award"]} className="w-5 h-5 mb-1.5 mx-auto block" />
                <span className="font-bold text-xs">Print Overlay Only (.docx)</span>
                <span className="block text-[10px] text-slate-400/80 mt-1 font-medium">For pre-printed cardstocks</span>
              </button>
            </div>

            {/* Guidelines */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs text-slate-500 leading-relaxed font-semibold">
              <p className="flex items-center gap-2 text-slate-700 font-bold mb-1">
                <FontAwesomeIcon icon={["fas", "circle-info"]} className="text-emerald-600" />
                <span>Compilation Instructions:</span>
              </p>
              <p>1. Make sure you have uploaded the template files to your Vite public/ folder.</p>
              <p>2. Clicking download will automatically generate the file and archive the request status.</p>
              {printMode === "overlay" && <p className="text-emerald-700 mt-1">💡 You have chosen Overlay: only student text fields will be printed. Load your pre-printed cardstock into your printer once you download and open the Word file!</p>}
            </div>

            {/* Action buttons */}
            <div className="flex gap-3 justify-end pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => { setIsPrintModalOpen(false); setSelectedGMForPrint(null); }}
                className="px-4 py-2.5 rounded-xl hover:bg-slate-100 text-slate-500 font-bold text-xs cursor-pointer transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => generateDocument(selectedGMForPrint, printMode)}
                disabled={loading}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <FontAwesomeIcon icon={loading ? ["fas", "spinner"] : ["fas", "file-arrow-down"]} className={loading ? "animate-spin" : ""} />
                <span>{loading ? "Generating..." : "Download Word File"}</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}