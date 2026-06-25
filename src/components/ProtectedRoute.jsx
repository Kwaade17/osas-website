import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { supabase } from "../supabaseClient";

export default function PostReader() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch the specific row dynamically on mount
  useEffect(() => {
    const fetchPost = async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("id", id)
        .single(); // Pull exactly one row matching the ID

      if (!error) {
        setPost(data);
      }
      setLoading(false);
    };

    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50">
        <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center text-red-500 mb-4">
          <FontAwesomeIcon icon={["fas", "triangle-exclamation"]} className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-800">Article Not Found</h2>
        <p className="text-slate-400 font-semibold text-sm mt-1">This article might have been deleted by an administrator.</p>
        <Link to="/" className="mt-6 inline-flex items-center space-x-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-5 py-3 rounded-xl transition-colors">
          <span>Back to Home</span>
        </Link>
      </div>
    );
  }

  return (
    <article className="min-h-screen bg-slate-50/50 py-12 px-4 md:px-6 overflow-x-hidden">
      <div className="max-w-3xl mx-auto space-y-6">
        
        {/* Back Link */}
        <Link 
          to="/" 
          className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-400 hover:text-emerald-700 transition-colors duration-200 group"
        >
          <FontAwesomeIcon 
            icon={["fas", "chevron-left"]} 
            className="w-2.5 h-2.5 transform group-hover:-translate-x-0.5 transition-transform" 
          />
          <span>Back to Home</span>
        </Link>

        {/* Article Metadata */}
        <div className="space-y-4">
          <span className="inline-flex items-center gap-2 rounded-full border border-emerald-100 bg-emerald-50 px-3 py-0.5 text-[10px] font-bold uppercase tracking-wider text-emerald-700 shadow-xs">
            {post.type || "Official Update"}
          </span>
          
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-slate-400">
            <span>By: <strong className="text-slate-600">{post.author || "OSAS Office"}</strong></span>
            <span className="text-slate-200">|</span>
            <span>{post.date}</span>
          </div>
        </div>

        {/* COVER PHOTO HAS BEEN ENTIRELY REMOVED AS REQUESTED! */}

        {/* HTML Text Area */}
        <div 
          className="rich-text-viewer text-slate-600 leading-relaxed font-medium text-sm md:text-base space-y-5 bg-white border border-slate-100 rounded-3xl p-6 md:p-10 shadow-xs break-words overflow-hidden w-full"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

      </div>
    </article>
  );
}