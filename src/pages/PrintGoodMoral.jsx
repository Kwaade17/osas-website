import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { supabase } from "../supabaseClient";

export default function PrintGoodMoral() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);

  // Print Mode Options: "full" (entire certificate) or "overlay" (text variables only)
  const mode = searchParams.get("mode") || "full";

  // Interactive Alignment Sliders (Stops paper waste!)
  const [topOffset, setTopOffset] = useState(0);
  const [leftOffset, setLeftOffset] = useState(0);

  useEffect(() => {
    fetchRequest();
  }, [id]);

  const fetchRequest = async () => {
    const { data, error } = await supabase
      .from("good_moral_requests")
      .select("*")
      .eq("id", id)
      .single();

    if (!error) {
      setRequest(data);
    }
    setLoading(false);
  };

  const handlePrint = async () => {
    window.print();
    // Update status to 'Printed' once printed
    await supabase
      .from("good_moral_requests")
      .update({ status: "Printed" })
      .eq("id", id);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-red-500 font-bold">Request details not found.</h2>
      </div>
    );
  }

  const isUndergrad = request.level_type === "Undergraduate";

  return (
    <div className="min-h-screen bg-slate-100 py-8 px-4 flex flex-col items-center">
      
      {/* --- NO-PRINT FLOATING ADJUSTMENT CONTROL PANEL --- */}
      <div className="print:hidden w-full max-w-2xl bg-white border border-slate-200 rounded-2xl p-6 mb-8 shadow-md space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="font-black text-slate-800 text-base">Print Alignment Controller</h3>
            <p className="text-xs text-slate-400 font-semibold mt-0.5">
              Adjust spacing to align text variables with pre-printed certificate sheets
            </p>
          </div>
          <button 
            onClick={() => navigate("/dashboard")}
            className="text-xs font-bold text-slate-400 hover:text-slate-600 flex items-center gap-1"
          >
            <FontAwesomeIcon icon={["fas", "chevron-left"]} />
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase flex justify-between">
              <span>Vertical Shift (Up/Down)</span>
              <span className="text-emerald-600 font-black">{topOffset}px</span>
            </label>
            <input 
              type="range" min="-100" max="100" value={topOffset} onChange={e => setTopOffset(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase flex justify-between">
              <span>Horizontal Shift (Left/Right)</span>
              <span className="text-emerald-600 font-black">{leftOffset}px</span>
            </label>
            <input 
              type="range" min="-100" max="100" value={leftOffset} onChange={e => setLeftOffset(parseInt(e.target.value))}
              className="w-full h-1 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-emerald-600"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 pt-2">
          <button 
            onClick={handlePrint}
            className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl shadow-xs cursor-pointer flex items-center gap-2"
          >
            <FontAwesomeIcon icon={["fas", "print"]} />
            <span>Print Document</span>
          </button>
        </div>
      </div>

      {/* --- THE PRINTABLE CANVAS SHEET --- */}
      {/* Uses absolute print positioning tailored to standard Letter/A4 paper sizes */}
      <div 
        id="printable-document"
        className="bg-white border border-slate-300 shadow-2xl rounded-sm w-[8.5in] h-[11in] relative overflow-hidden p-[1in] text-slate-900 font-serif leading-relaxed"
        style={{
          transform: `translate(${leftOffset}px, ${topOffset}px)`,
          transformOrigin: "top left"
        }}
      >
        {/* MODE 1: RENDER FULL WEB CERTIFICATE (Matching Screenshot 3 & 4) */}
        {mode === "full" && (
          <div className="w-full h-full relative flex flex-col justify-between select-none">
            {/* Letterhead */}
            <div className="flex items-start justify-between border-b border-slate-900 pb-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center font-bold text-xs">LCCC Seal</div>
                <div className="space-y-0.5">
                  <h4 className="font-extrabold text-sm uppercase tracking-wide">La Carlota City College</h4>
                  <p className="text-[10px] text-slate-500">Gurrea Street, La Carlota City, Negros Occidental</p>
                  <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">Office of Student Affairs</p>
                </div>
              </div>
            </div>

            {/* Document Body */}
            <div className="flex-1 py-16 space-y-12">
              <h2 className="text-center font-black text-xl uppercase tracking-widest text-slate-800">Certificate of Good Moral Character</h2>
              
              <div className="space-y-6 text-sm leading-loose">
                <p>To whom it may concern:</p>
                
                {isUndergrad ? (
                  <p className="indent-12">
                    This is to certify that <strong className="border-b border-slate-800 pb-0.5">{request.student_name}</strong>, a bona fide <strong className="border-b border-slate-800 pb-0.5">{request.year_level} Year</strong> student of La Carlota City College during the <strong className="border-b border-slate-800 pb-0.5">{request.semester} Semester</strong> of School Year <strong className="border-b border-slate-800 pb-0.5">{request.school_year}</strong>, is of good moral character.
                  </p>
                ) : (
                  <p className="indent-12">
                    This is to certify that <strong className="border-b border-slate-800 pb-0.5">{request.student_name}</strong>, a graduate of <strong className="border-b border-slate-800 pb-0.5">{request.course}</strong> of La Carlota City College as of <strong className="border-b border-slate-800 pb-0.5">{request.or_date}</strong>, is of good moral character.
                  </p>
                )}

                <p className="indent-12">
                  This certification is issued upon the request of the above-named person for whatever lawful purpose it may serve him/her best.
                </p>
                <p className="indent-12">
                  Done this <strong className="border-b border-slate-800 pb-0.5">{new Date().getDate()}th</strong> day of <strong className="border-b border-slate-800 pb-0.5">{new Date().toLocaleDateString("en-US", { month: "long" })}</strong>, {new Date().getFullYear()} at La Carlota City, Negros Occidental.
                </p>
              </div>
            </div>

            {/* Signatory Footer */}
            <div className="flex justify-between items-end border-t border-slate-200 pt-8">
              <div className="text-[10px] space-y-1 text-slate-500">
                <p>O.R. No: <strong>{request.or_number}</strong></p>
                <p>Date Paid: <strong>{request.or_date}</strong></p>
              </div>
              <div className="text-center space-y-1">
                <p className="font-extrabold text-sm uppercase">Laurence M. Lachica, MPA</p>
                <p className="text-[10px] text-emerald-800 font-bold uppercase tracking-wider">Head, Student Affairs</p>
              </div>
            </div>
          </div>
        )}

        {/* MODE 2: PRINT OVERLAY VARIABLES ONLY (Matching Screenshot 1 & 2) */}
        {mode === "overlay" && (
          <div className="w-full h-full relative select-none font-bold text-xs uppercase tracking-wide">
            {/* Absolute variables mapped to fit pre-printed parchment coordinates exactly */}
            {isUndergrad ? (
              <>
                <div className="absolute top-[2.2in] left-[4.8in]">{request.student_name}</div>
                <div className="absolute top-[2.55in] left-[1.6in]">{request.year_level}</div>
                <div className="absolute top-[2.85in] left-[4.2in]">{request.semester}</div>
                <div className="absolute top-[3.15in] left-[2.4in]">{request.school_year}</div>
                <div className="absolute top-[4.65in] left-[1.8in]">{new Date().getDate()}th</div>
                <div className="absolute top-[4.65in] left-[3.2in]">{new Date().toLocaleDateString("en-US", { month: "long" })}</div>
                <div className="absolute top-[4.65in] left-[5.4in]">{new Date().getFullYear()}</div>
                <div className="absolute bottom-[0.8in] left-[0in]">{request.or_number}</div>
                <div className="absolute bottom-[0.6in] left-[0in]">{request.or_date}</div>
              </>
            ) : (
              <>
                <div className="absolute top-[2.2in] left-[4.8in]">{request.student_name}</div>
                <div className="absolute top-[2.55in] left-[1.6in]">{request.course}</div>
                <div className="absolute top-[2.85in] left-[4.2in]">{request.or_date}</div>
                <div className="absolute top-[3.15in] left-[2.4in]">{request.school_year}</div>
                <div className="absolute top-[4.65in] left-[1.8in]">{new Date().getDate()}th</div>
                <div className="absolute top-[4.65in] left-[3.2in]">{new Date().toLocaleDateString("en-US", { month: "long" })}</div>
                <div className="absolute top-[4.65in] left-[5.4in]">{new Date().getFullYear()}</div>
                <div className="absolute bottom-[0.8in] left-[0in]">{request.or_number}</div>
                <div className="absolute bottom-[0.6in] left-[0in]">{request.or_date}</div>
              </>
            )}
          </div>
        )}
      </div>

    </div>
  );
}