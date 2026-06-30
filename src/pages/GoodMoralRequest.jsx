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
  
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

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
            <h2 className="text-xl font-black text-slate-800">Good Moral Clearance Request</h2>
            <p className="text-xs text-slate-400 font-semibold leading-normal">Online Student Self-Service Form</p>
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

            {/* Student Type Selection */}
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
                <input 
                  type="text" required value={course} onChange={e => setCourse(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-700"
                  placeholder="E.g., B.S.B.A. - FM or M.P.A."
                />
              </div>
            </div>

            {/* Conditional Fields based on Student Type */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-slate-500 uppercase">School Year</label>
                <input 
                  type="text" required value={schoolYear} onChange={e => setSchoolYear(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-sm font-semibold text-slate-700"
                  placeholder="E.g., 2025 - 2026"
                />
              </div>

              {studentType === "Undergraduate" ? (
                <div className="space-y-1">
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
              {loading ? "Submitting Request..." : "Submit Clearance Request"}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}