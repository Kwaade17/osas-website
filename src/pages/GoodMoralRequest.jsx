import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { supabase } from "../supabaseClient";

export default function GoodMoralRequest() {
  const [name, setName] = useState("");
  const [studentType, setStudentType] = useState("Undergraduate");
  const [course, setCourse] = useState("");
  const [schoolYear, setSchoolYear] = useState("");
  const [semester, setSemester] = useState("1st");
  const [gradDate, setGradDate] = useState("");
  const [orNumber, setOrNumber] = useState("");
  const [orDate, setOrDate] = useState("");
  
  // 💡 NEW STATE: Stores Year Level for Undergraduates
  const [yearLevel, setYearLevel] = useState("1st");
  const [syStart, setSyStart] = useState("");
  const [syEnd, setSyEnd] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // 💡 AUTO-CALCULATOR: If start year is typed, automatically fill end year with +1
  const handleSyStartChange = (val) => {
    // Strip out non-numeric characters
    const cleanVal = val.replace(/[^0-9]/g, "");
    setSyStart(cleanVal);
    
    const yearNum = parseInt(cleanVal, 10);
    if (!isNaN(yearNum) && cleanVal.length === 4) {
      setSyEnd(String(yearNum + 1));
      setSchoolYear(`${cleanVal} - ${yearNum + 1}`); // Syncs to the real database column!
    } else {
      setSyEnd("");
      setSchoolYear("");
    }
  };

  // 💡 AUTO-CALCULATOR: If end year is typed, automatically fill start year with -1
  const handleSyEndChange = (val) => {
    const cleanVal = val.replace(/[^0-9]/g, "");
    setSyEnd(cleanVal);
    
    const yearNum = parseInt(cleanVal, 10);
    if (!isNaN(yearNum) && cleanVal.length === 4) {
      setSyStart(String(yearNum - 1));
      setSchoolYear(`${yearNum - 1} - ${cleanVal}`); // Syncs to the real database column!
    } else {
      setSyStart("");
      setSchoolYear("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !course || !orNumber || !orDate) return;
    setLoading(true);

    const { error } = await supabase
      .from("good_moral_requests")
      .insert([
        {
          student_name: name.toUpperCase(), // Store uppercase per college standard
          student_type: studentType,
          course_major: course,
          school_year: schoolYear,
          semester: studentType === "Undergraduate" ? semester : null,
          year_level: studentType === "Undergraduate" ? yearLevel : null, // 💡 SAVES TO DATABASE COLUMNS
          grad_date: studentType === "Graduate" ? gradDate : null,
          or_number: orNumber,
          or_date: orDate,
          source: "online",
          status: "pending" // Needs admin review and approval
        }
      ]);

    if (error) {
      alert("Failed to submit request: " + error.message);
    } else {
      setSubmitted(true);
    }
    setLoading(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6 text-center bg-slate-50">
        <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 mb-4 border border-emerald-100 shadow-xs">
          <FontAwesomeIcon icon={["fas", "circle-check"]} className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-black text-slate-800 leading-tight">Request Submitted!</h2>
        <p className="text-slate-500 font-semibold text-sm mt-2 max-w-md">
          Your request has been successfully queued. Please proceed to the OSAS Office (TETC Building, Room #5) to claim your physical certificate once verified.
        </p>
        <Link to="/" className="mt-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-3 rounded-xl transition-colors shadow-xs">
          Back to Home
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 md:px-6">
      <div className="max-w-xl mx-auto space-y-6">
        
        {/* Navigation Back Link */}
        <Link to="/" className="inline-flex items-center space-x-1.5 text-xs font-bold text-slate-400 hover:text-emerald-700 transition-colors">
          <FontAwesomeIcon icon={["fas", "chevron-left"]} />
          <span>Back to Home</span>
        </Link>

        {/* Form Card */}
        <div className="bg-white border border-slate-200 shadow-xl rounded-3xl p-6 md:p-8 space-y-6">
          <div className="text-center space-y-2 pb-4 border-b border-slate-100">
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto text-emerald-700">
              <FontAwesomeIcon icon={["fas", "certificate"]} className="w-6 h-6" />
            </div>
            <h2 className="text-xl font-black text-slate-800">Good Moral Certificate Request</h2>
            <p className="text-xs text-slate-400 font-semibold leading-normal">Online Self-Service Form</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Student Name */}
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-500 uppercase">Full Name</label>
              <input 
                type="text" required value={name} onChange={e => setName(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-700 uppercase"
                placeholder="SURNAME, FIRST NAME, MIDDLE INITIAL"
              />
            </div>

            {/* Student Type & Course */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Student Type</label>
                <select 
                  value={studentType} onChange={e => setStudentType(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-700 bg-white"
                >
                  <option value="Undergraduate">Undergraduate Student</option>
                  <option value="Graduate">Graduate Student</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Course / Major / Degree</label>
                  <select 
                    value={course} onChange={e => setCourse(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-700 bg-white"
                  >
                    {/* 💡 FIXED: All value attributes now match their actual academic courses instead of "Graduate"! */}
                    <option value="">Select Course / Degree</option>
                    <option value="B.S.Agric. - Agronomy">B.S.Agric. - Agronomy</option>
                    <option value="B.S.O.A.">B.S.O.A.</option>
                    <option value="B.S.M.A.">B.S.M.A.</option>
                    <option value="B.S.B.A. - FM">B.S.B.A. - FM</option>
                    <option value="B.P.A.">B.P.A.</option>
                    <option value="B.S. - Crim.">B.S. - Crim.</option>
                    <option value="B.E.Ed.">B.E.Ed.</option>
                    <option value="B.E.C.Ed.">B.E.C.Ed.</option>
                    <option value="B.P.Ed.">B.P.Ed.</option>
                    <option value="B.S.Ed. - English">B.S.Ed. - English</option>
                    <option value="B.S.Ed. - Filipino">B.S.Ed. - Filipino</option>
                    <option value="B.S.Ed. - Math">B.S.Ed. - Math</option>
                    <option value="A.B. - ELS">A.B. - ELS</option>
                    <option value="M.A.Ed. - Educational Management">M.A.Ed. - Educational Management</option>
                    <option value="M.A.Ed. - English">M.A.Ed. - English</option>
                    <option value="M.A.Ed. - Filipino">M.A.Ed. - Filipino</option>
                    <option value="M.A.Ed. - Mathematics">M.A.Ed. - Mathematics</option>
                    <option value="M.B.A.">M.B.A.</option>
                    <option value="M.P.A.">M.P.A.</option>
                    <option value="PhD - Educational Management">PhD - Educational Management</option>
                  </select>
              </div>
            </div>

            {/* School Year & Conditional Field (Year Level / Graduation Date) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">School Year</label>
                <div className="flex items-center gap-2.5">
                  <input 
                    type="text" 
                    required 
                    maxLength={4}
                    value={syStart} 
                    onChange={e => handleSyStartChange(e.target.value)}
                    className="w-24 px-3 py-2 rounded-xl border border-slate-200 text-center text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    placeholder="Start"
                  />
                  <span className="text-slate-400 font-bold">-</span>
                  <input 
                    type="text" 
                    required 
                    maxLength={4}
                    value={syEnd} 
                    onChange={e => handleSyEndChange(e.target.value)}
                    className="w-24 px-3 py-2 rounded-xl border border-slate-200 text-center text-sm font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600"
                    placeholder="End"
                  />
                  {/* 💡 LIVE ERROR CHECKER: Displays a warning if they stop typing mid-way */}
                  {((syStart.length > 0 && syStart.length < 4) || (syEnd.length > 0 && syEnd.length < 4)) && (
                    <span className="text-[10px] text-red-500 font-extrabold animate-pulse ml-1.5 uppercase tracking-wide">Invalid Year</span>
                  )}
                </div>
              </div>

              {studentType === "Undergraduate" ? (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Year Level</label>
                  <select 
                    value={yearLevel} onChange={e => setYearLevel(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-700 bg-white"
                  >
                    <option value="1st">1st</option>
                    <option value="2nd">2nd</option>
                    <option value="3rd">3rd</option>
                    <option value="4th">4th</option>
                  </select>
                </div>
              ) : (
                <div className="space-y-1">
                  <label className="text-xs font-bold text-slate-500 uppercase">Graduation Date</label>
                  <input 
                    type="text" required value={gradDate} onChange={e => setGradDate(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-700"
                    placeholder="E.g., March 17, 2017"
                  />
                </div>
              )}
            </div>

            {/* Semester (Only visible for Undergraduates) */}
            {studentType === "Undergraduate" && (
              <div className="space-y-1 animate-in fade-in duration-300">
                <label className="text-xs font-bold text-slate-500 uppercase">Semester</label>
                <select 
                  value={semester} onChange={e => setSemester(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-700 bg-white"
                >
                  <option value="1st">1st</option>
                  <option value="2nd">2nd</option>
                  <option value="Summer">Summer</option>
                </select>
              </div>
            )}

            {/* Official Receipt (O.R.) Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">O.R. Number</label>
                <input 
                  type="text" required value={orNumber} onChange={e => setOrNumber(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-700"
                  placeholder="E.g., 8720792"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">Date of Payment</label>
                <input 
                  type="date" required value={orDate} onChange={e => setOrDate(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-700 bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl shadow-xs transition-colors duration-200 cursor-pointer active:scale-98 text-sm disabled:opacity-50"
            >
              {loading ? "Submitting Request..." : "Submit Good Moral Request"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}