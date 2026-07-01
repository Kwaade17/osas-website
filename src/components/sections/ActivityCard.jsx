import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { supabase } from "../../supabaseClient";

export default function ActivityCard() {
  const [nextEvent, setNextEvent] = useState(null);
  const [secondEvent, setSecondEvent] = useState(null); // 💡 State for the queued next event
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchActiveEvents();
  }, []);

  // Fetch the closest two active events
  const fetchActiveEvents = async () => {
    setLoading(true);
    const todayStr = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .or(`activity_date.gte.${todayStr},end_date.gte.${todayStr}`)
      .order("activity_date", { ascending: true })
      .limit(2); // 💡 Fetch up to 2 events to support our upcoming queue!

    if (!error && data && data.length > 0) {
      setNextEvent(data[0]);
      if (data.length > 1) {
        setSecondEvent(data[1]);
      } else {
        setSecondEvent(null);
      }
    } else {
      setNextEvent(null);
      setSecondEvent(null);
    }
    setLoading(false);
  };

  // Real-time ticking loop for the active event
  useEffect(() => {
    if (!nextEvent) return;

    const calculateTimer = () => {
      const now = new Date();
      const startDate = new Date(nextEvent.activity_date + "T00:00:00");
      const endDate = nextEvent.end_date 
        ? new Date(nextEvent.end_date + "T23:59:59") 
        : new Date(nextEvent.activity_date + "T23:59:59");

      const isOngoing = now >= startDate && now <= endDate;
      const targetDate = isOngoing ? endDate : startDate;
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ difference: 0, isToday: false, isOngoing: false });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ difference, isToday: false, isOngoing, days, hours, minutes, seconds });
    };

    calculateTimer();
    const interval = setInterval(calculateTimer, 1000);

    return () => clearInterval(interval);
  }, [nextEvent]);

  const padZero = (num) => String(num).padStart(2, "0");

  // Calculates how many days are left until the queued second event starts
  const getSecondEventDaysLeft = () => {
    if (!secondEvent) return null;
    const targetDate = new Date(secondEvent.activity_date + "T00:00:00");
    const now = new Date();
    const difference = targetDate - now;
    if (difference <= 0) return 0;
    return Math.floor(difference / (1000 * 60 * 60 * 24));
  };

  const secondEventDaysLeft = getSecondEventDaysLeft();
  // 💡 CONDITIONAL RULE: Only display the second event if it is starting in 3 days or less!
  const showSecondEvent = secondEventDaysLeft !== null && secondEventDaysLeft <= 3;

  if (loading) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 flex justify-center items-center h-32 shadow-sm">
          <div className="w-8 h-8 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      </div>
    );
  }

  const daysLeft = timeLeft ? timeLeft.days : 999;
  const isOngoing = timeLeft ? timeLeft.isOngoing : false;

  // Render fallback if no events or if event is more than 7 days away (and not currently ongoing)
  if (!nextEvent || (daysLeft > 7 && !isOngoing)) {
    return (
      <div className="w-full max-w-4xl mx-auto px-4">
        <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
            <div className="w-12 h-12 bg-slate-50 text-slate-400 rounded-2xl flex items-center justify-center border border-slate-100">
              <FontAwesomeIcon icon={["fas", "calendar-check"]} className="w-5 h-5 text-emerald-600/50" />
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Academic Calendar</span>
              <h3 className="font-extrabold text-slate-800 text-base mt-0.5">Currently No Scheduled Events</h3>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">There are no major administrative deadlines scheduled for this week.</p>
            </div>
          </div>
          <span className="text-[10px] font-bold text-emerald-600/30 uppercase tracking-widest select-none">Stay Tuned</span>
        </div>
      </div>
    );
  }

  // Format Date string helper (E.g., "July 6" or "July 6 - July 9, 2026")
  const formatDuration = (event) => {
    if (!event) return "";
    const start = new Date(event.activity_date + "T00:00:00");
    const startStr = start.toLocaleDateString("en-US", { month: "long", day: "numeric" });

    if (event.end_date && event.end_date !== event.activity_date) {
      const end = new Date(event.end_date + "T00:00:00");
      const endStr = end.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
      return `${startStr} - ${endStr}`;
    }

    return `${start.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}`;
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className={`bg-white border border-slate-200 rounded-3xl p-6 flex flex-col shadow-md border-l-4 relative overflow-hidden transition-all duration-300 ${
        isOngoing ? "border-l-blue-600 shadow-blue-900/5" : "border-l-emerald-600"
      }`}>
        
        {/* Top Section: Main Content Split */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6 w-full">
          {/* Left Side: Event Details */}
          <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border flex-shrink-0 ${
              isOngoing ? "bg-blue-50 text-blue-700 border-blue-100" : "bg-emerald-50 text-emerald-700 border-emerald-100"
            }`}>
              <FontAwesomeIcon icon={["fas", isOngoing ? "hourglass-half" : "calendar-day"]} className={`w-5 h-5 ${isOngoing ? "animate-spin text-blue-600" : ""}`} />
            </div>
            <div>
              <div className="flex items-center gap-2 justify-center sm:justify-start">
                <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider border ${
                  isOngoing 
                    ? "bg-blue-50 text-blue-800 border-blue-100/50" 
                    : "bg-emerald-50 text-emerald-800 border-emerald-100/50"
                }`}>
                  {isOngoing ? "Ongoing Event" : "Upcoming Event"}
                </span>
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  {nextEvent.start_time} | {nextEvent.location}
                </span>
              </div>

              {/* 💡 THE LIVE TITLE UPDATE: 
                  If ongoing, hide the static title placeholder and render the custom live ongoing update! */}
              <h3 className="font-extrabold text-slate-900 text-lg mt-1.5 leading-snug">
                {isOngoing && nextEvent.ongoing_update ? nextEvent.ongoing_update : nextEvent.title}
              </h3>
              
              {/* If ongoing, we show the static description */}
              {isOngoing && <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">{nextEvent.description}</p>}
              
              <p className="text-[10px] text-slate-400 font-bold mt-2 uppercase tracking-wider">Duration: {formatDuration(nextEvent)}</p>
            </div>
          </div>

          {/* Right Side: Action Indicators & Timers */}
          <div className="flex-shrink-0 select-none">
            {/* 💡 FIXED: Ongoing events now show a clean live pulse indicator badge with NO ticking timer! */}
            {isOngoing && (
              <div className="flex items-center gap-2 bg-blue-50 text-blue-700 border border-blue-100 px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider shadow-sm">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-600 animate-ping"></div>
                <span>Event In Progress</span>
              </div>
            )}

            {/* Standard Upcoming Countdown (4 to 7 days left) */}
            {!isOngoing && daysLeft > 3 && daysLeft <= 7 && (
              <div className="text-center sm:text-right">
                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Countdown</span>
                <span className="text-2xl font-black text-slate-800 mt-1 block">
                  {daysLeft} days left
                </span>
              </div>
            )}

            {/* Standard Upcoming Timer (24h to 3 days left) */}
            {!isOngoing && daysLeft >= 1 && daysLeft <= 3 && timeLeft && (
              <div className="text-center sm:text-right space-y-1">
                <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Remaining</span>
                <div className="flex items-center gap-1.5 justify-center sm:justify-end text-slate-800">
                  <span className="text-xl font-black">{daysLeft}d</span>
                  <span className="text-xl font-black">:</span>
                  <span className="text-xl font-black bg-slate-100 px-2 py-1 rounded-lg">{timeLeft.hours}h</span>
                  <span className="text-xl font-black text-slate-400">:</span>
                  <span className="text-xl font-black bg-slate-100 px-2 py-1 rounded-lg">{padZero(timeLeft.minutes)}m</span>
                  <span className="text-xl font-black text-slate-400">:</span>
                  <span className="text-xl font-black bg-slate-100 px-2 py-1 rounded-lg text-emerald-600">{padZero(timeLeft.seconds)}s</span>
                </div>
              </div>
            )}

            {/* Standard Upcoming Timer (Under 24 hours) */}
            {!isOngoing && daysLeft === 0 && timeLeft && (
              <div className="text-center sm:text-right space-y-1">
                <span className="block text-[10px] font-black text-emerald-500 uppercase tracking-widest animate-pulse font-bold">Time Left Remaining:</span>
                <div className="flex items-center gap-1.5 justify-center sm:justify-end text-slate-800">
                  <span className="text-xl font-black bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-1 rounded-lg">{padZero(timeLeft.hours)}</span>
                  <span className="text-xl font-black text-emerald-400">:</span>
                  <span className="text-xl font-black bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-1 rounded-lg">{padZero(timeLeft.minutes)}</span>
                  <span className="text-xl font-black text-emerald-400">:</span>
                  <span className="text-xl font-black bg-emerald-600 text-white px-2 py-1 rounded-lg animate-pulse">{padZero(timeLeft.seconds)}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* --- 💡 3. THE NEXT EVENT QUEUE SECTION (Only visible if the current event is ongoing AND the next event starts in <= 3 days!) --- */}
        {isOngoing && showSecondEvent && (
          <div className="border-t border-slate-100 pt-4 mt-4 flex items-center justify-between gap-4 text-xs font-semibold text-slate-500 bg-slate-50/50 p-3 rounded-2xl border border-slate-100 animate-in fade-in slide-in-from-bottom-2 duration-300">
            <div className="flex items-center gap-2">
              <FontAwesomeIcon icon={["fas", "hourglass-half"]} className="w-3.5 h-3.5 text-blue-500 animate-pulse" />
              <span>Up Next: <strong className="text-slate-800">{secondEvent.title}</strong></span>
            </div>
            <div className="text-[10px] font-bold bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full uppercase tracking-wider">
              {secondEventDaysLeft === 0 ? "Starts Today!" : `Starts in ${secondEventDaysLeft} ${secondEventDaysLeft === 1 ? "day" : "days"}`}
            </div>
          </div>
        )}

      </div>
    </div>
  );
}