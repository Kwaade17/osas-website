import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { supabase } from "../../supabaseClient";

export default function ActivityCard() {
  const [nextEvent, setNextEvent] = useState(null);
  const [timeLeft, setTimeLeft] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchNearestEvent();
  }, []);

  // Fetch the closest upcoming event
  const fetchNearestEvent = async () => {
    setLoading(true);
    const todayStr = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"

    const { data, error } = await supabase
      .from("activities")
      .select("*")
      .gte("activity_date", todayStr) // Only future or current events
      .order("activity_date", { ascending: true }) // Closest event first
      .limit(1);

    if (!error && data && data.length > 0) {
      setNextEvent(data[0]);
    } else {
      setNextEvent(null);
    }
    setLoading(false);
  };

  // Real-time ticking loop
  useEffect(() => {
    if (!nextEvent) return;

    const calculateTimer = () => {
      const targetDate = new Date(nextEvent.activity_date + "T00:00:00");
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        const isToday = now.toDateString() === targetDate.toDateString();
        setTimeLeft({ difference: 0, isToday });
        return;
      }

      const days = Math.floor(difference / (1000 * 60 * 60 * 24));
      const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((difference % (1000 * 60)) / 1000);

      setTimeLeft({ difference, isToday: false, days, hours, minutes, seconds });
    };

    calculateTimer();
    const interval = setInterval(calculateTimer, 1000);

    return () => clearInterval(interval);
  }, [nextEvent]);

  const padZero = (num) => String(num).padStart(2, "0");

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
  const isToday = timeLeft ? timeLeft.isToday : false;

  // If no events are scheduled, or the next event is more than 7 days away
  if (!nextEvent || (daysLeft > 7 && !isToday)) {
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

  return (
    <div className="w-full max-w-4xl mx-auto px-4">
      <div className="bg-white border border-slate-200 rounded-3xl p-6 flex flex-col sm:flex-row items-center justify-between gap-6 shadow-md border-l-4 border-l-emerald-600 relative overflow-hidden">
        
        {/* Left Side: Event Details */}
        <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
          <div className="w-12 h-12 bg-emerald-50 text-emerald-700 rounded-2xl flex items-center justify-center border border-emerald-100">
            <FontAwesomeIcon icon={["fas", "calendar-day"]} className={`w-5 h-5 ${isToday ? "animate-bounce text-emerald-600" : ""}`} />
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full uppercase tracking-wider border border-emerald-100/50">
                {isToday ? "Happening Today!" : "Upcoming Event"}
              </span>
              {!isToday && <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{nextEvent.start_time} | {nextEvent.location}</span>}
            </div>
            <h3 className="font-extrabold text-slate-900 text-lg mt-1">{nextEvent.title}</h3>
            <p className="text-xs text-slate-500 font-medium mt-0.5 leading-relaxed">{nextEvent.description}</p>
          </div>
        </div>

        {/* Right Side: Timers */}
        <div className="flex-shrink-0 select-none">
          {/* 4 to 7 days left (Wording changed to "6 days left" as requested) */}
          {!isToday && daysLeft > 3 && daysLeft <= 7 && (
            <div className="text-center sm:text-right">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Countdown</span>
              <span className="text-2xl font-black text-slate-800 mt-1 block">
                {daysLeft} days left
              </span>
            </div>
          )}

          {/* 24h to 3 days left */}
          {!isToday && daysLeft >= 1 && daysLeft <= 3 && timeLeft && (
            <div className="text-center sm:text-right space-y-1">
              <span className="block text-[10px] font-black text-slate-400 uppercase tracking-widest">Time Remaining</span>
              <div className="flex items-center gap-1.5 justify-center sm:justify-end text-slate-800">
                <span className="text-xl font-black">{daysLeft}d</span>
                <span className="text-xl font-black">:</span>
                <span className="text-xl font-black bg-slate-100 px-2 py-1 rounded-lg tabular-nums">{padZero(timeLeft.hours)}</span>
                <span className="text-xl font-black">:</span>
                <span className="text-xl font-black bg-slate-100 px-2 py-1 rounded-lg tabular-nums">{padZero(timeLeft.minutes)}</span>
                <span className="text-xl font-black">:</span>
                <span className="text-xl font-black bg-slate-100 px-2 py-1 rounded-lg text-emerald-600 tabular-nums">{padZero(timeLeft.seconds)}</span>
              </div>
            </div>
          )}

          {/* Under 24 hours */}
          {!isToday && daysLeft === 0 && timeLeft && (
            <div className="text-center sm:text-right space-y-1">
              <span className="block text-[10px] font-black text-emerald-500 uppercase tracking-widest animate-pulse font-bold">Approaching Deadline</span>
              <div className="flex items-center gap-1.5 justify-center sm:justify-end text-slate-800">
                <span className="text-xl font-black bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-1 rounded-lg tabular-nums">{padZero(timeLeft.hours)}</span>
                <span className="text-xl font-black text-emerald-400">:</span>
                <span className="text-xl font-black bg-emerald-50 text-emerald-600 border border-emerald-100 px-2 py-1 rounded-lg tabular-nums">{padZero(timeLeft.minutes)}</span>
                <span className="text-xl font-black text-emerald-400">:</span>
                <span className="text-xl font-black bg-emerald-600 text-white px-2 py-1 rounded-lg animate-pulse tabular-nums">{padZero(timeLeft.seconds)}</span>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}