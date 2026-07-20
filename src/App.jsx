import { useState, useEffect, useRef } from "react";

// ─── TEAM PALETTE ─────────────────────────────────────────────────────────────
const TEAM_PALETTE = [
  { primary:"#C8102E", secondary:"#FFD700" }, // Red/Gold (Chiefs-ish)
  { primary:"#003087", secondary:"#FFB81C" }, // Navy/Gold (Steelers-ish)
  { primary:"#006341", secondary:"#D4AF37" }, // Green/Gold (Packers-ish)
  { primary:"#4B0082", secondary:"#C0C0C0" }, // Purple/Silver (Vikings-ish)
  { primary:"#E87722", secondary:"#0C2340" }, // Orange/Navy (Broncos-ish)
  { primary:"#008E97", secondary:"#FC4C02" }, // Teal/Orange (Dolphins-ish)
  { primary:"#1a1a1a", secondary:"#C0C0C0" }, // Black/Silver (Raiders-ish)
  { primary:"#7B0000", secondary:"#FFB300" }, // Maroon/Gold (Texans-ish)
  { primary:"#0080C6", secondary:"#FFFFFF" }, // Sky Blue/White (Lions-ish)
  { primary:"#2C5F2E", secondary:"#97BC62" }, // Forest/Lime (Eagles-ish)
];

const TEAM_NAMES = [
  "Bulldogs","Wildcats","Tigers","Eagles","Raiders",
  "Panthers","Mustangs","Falcons","Warriors","Cougars",
  "Trojans","Rebels","Knights","Spartans","Vikings",
  "Wolves","Hornets","Bears","Cardinals","Rams",
  "Chargers","Stallions","Rockets","Braves","Titans",
  "Buccaneers","Grizzlies","Bobcats","Longhorns","Pioneers",
];

// ─── PLAYER POOLS ─────────────────────────────────────────────────────────────
// Offense positions: QB, RB, WR, TE, OL
// Defense positions: DL, LB, CB, S
// Stats differ by type

function makeOffensePlayer(id, name, pos, primary, secondary, speed, awareness) {
  const avg = (primary + secondary + speed + awareness) / 4;
  const tier = avg >= 78 ? "S" : avg >= 65 ? "A" : avg >= 52 ? "B" : "C";
  return { id, name, pos, primary, secondary, speed, awareness, tier, side: "offense" };
}
function makeDefensePlayer(id, name, pos, pass_rush, coverage, tackle, instinct) {
  const avg = (pass_rush + coverage + tackle + instinct) / 4;
  const tier = avg >= 78 ? "S" : avg >= 65 ? "A" : avg >= 52 ? "B" : "C";
  return { id, name, pos, pass_rush, coverage, tackle, instinct, tier, side: "defense" };
}

// STAT SEMANTICS:
// QB: primary=arm, secondary=accuracy, speed=mobility, awareness=football_iq
// RB: primary=power, secondary=elusiveness, speed=speed, awareness=vision
// WR: primary=route_running, secondary=hands, speed=speed, awareness=iq
// TE: primary=blocking, secondary=hands, speed=speed, awareness=iq
// OL: primary=run_block, secondary=pass_block, speed=quickness, awareness=iq
// DL: pass_rush=pass_rush, coverage=run_stop, tackle=tackle, instinct=instinct
// LB: pass_rush=blitz, coverage=coverage, tackle=tackle, instinct=instinct
// CB: pass_rush=press, coverage=coverage, tackle=tackle, instinct=instinct
// S:  pass_rush=blitz, coverage=zone, tackle=tackle, instinct=instinct

const QB_POOL = [
  // S-tier
  makeOffensePlayer("qb1","Sling Mahone","QB",92,88,72,90),
  makeOffensePlayer("qb2","Lob Brady","QB",85,95,65,94),
  makeOffensePlayer("qb3","Rush Rodgers","QB",88,82,85,88),
  makeOffensePlayer("qb4","Dart Lamar","QB",80,78,95,84),
  // A-tier
  makeOffensePlayer("qb5","Cannon Purdy","QB",78,90,70,86),
  makeOffensePlayer("qb6","Zip Wilson","QB",82,72,80,72),
  makeOffensePlayer("qb7","Hail Murray","QB",76,74,88,70),
  makeOffensePlayer("qb8","Gunslinger Jones","QB",88,65,68,76),
  makeOffensePlayer("qb9","Checkdown Charlie","QB",70,82,62,80),
  makeOffensePlayer("qb10","Scramble McFly","QB",65,68,90,66),
  makeOffensePlayer("qb11","Pocket Prescott","QB",74,78,64,76),
  makeOffensePlayer("qb12","Captain Clutch","QB",72,80,66,74),
  // B-tier
  makeOffensePlayer("qb13","Shovel Pass Sam","QB",72,70,64,72),
  makeOffensePlayer("qb14","Arm Punt Dalton","QB",68,64,60,68),
  makeOffensePlayer("qb15","Game Manager Gary","QB",62,74,58,72),
  makeOffensePlayer("qb16","Dink Dunker Derrick","QB",60,76,56,70),
  makeOffensePlayer("qb17","Safety Valve Vic","QB",64,70,60,68),
  makeOffensePlayer("qb18","Backup Blaine","QB",58,68,58,64),
  // C-tier (avg must be < 52)
  makeOffensePlayer("qb19","Third Stringer Ted","QB",48,50,48,50),
  makeOffensePlayer("qb20","Camp Body Carl","QB",46,48,46,48),
  makeOffensePlayer("qb21","Practice Jake","QB",44,46,46,46),
  makeOffensePlayer("qb22","Clipboard Larry","QB",42,44,42,44),
];

const RB_POOL = [
  // S-tier
  makeOffensePlayer("rb1","Bulldozer Brown","RB",92,78,85,82),
  makeOffensePlayer("rb2","Juke Jones","RB",72,95,92,80),
  makeOffensePlayer("rb3","Freight Train Williams","RB",95,65,78,74),
  makeOffensePlayer("rb4","Elusive Eddie","RB",68,92,90,84),
  // A-tier
  makeOffensePlayer("rb5","Third Down Thompson","RB",70,80,80,88),
  makeOffensePlayer("rb6","Scatback Sanders","RB",62,88,94,78),
  makeOffensePlayer("rb7","Power Pollard","RB",85,70,76,72),
  makeOffensePlayer("rb8","Cutback King","RB",66,84,86,76),
  makeOffensePlayer("rb9","Receiving Back Rex","RB",64,82,80,82),
  makeOffensePlayer("rb10","Workhorse Warren","RB",78,68,74,74),
  makeOffensePlayer("rb11","Change of Pace Chad","RB",60,80,88,76),
  makeOffensePlayer("rb12","Red Zone Rex","RB",82,66,70,70),
  // B-tier
  makeOffensePlayer("rb13","Plodder Pete","RB",72,58,64,62),
  makeOffensePlayer("rb14","Fumble Fingers","RB",68,62,66,58),
  makeOffensePlayer("rb15","Checkdown Chester","RB",60,70,68,72),
  makeOffensePlayer("rb16","Gadget Guy Gordon","RB",56,72,78,68),
  makeOffensePlayer("rb17","Dive Right Dave","RB",70,56,60,64),
  makeOffensePlayer("rb18","Short Yardage Sal","RB",74,52,58,60),
  // C-tier (avg must be < 52)
  makeOffensePlayer("rb19","Practice Squad Pete","RB",48,44,50,46),
  makeOffensePlayer("rb20","Camp Carry Carlos","RB",44,46,50,44),
  makeOffensePlayer("rb21","Blocking Back Bob","RB",46,40,48,46),
  makeOffensePlayer("rb22","Fourth String Fred","RB",42,42,46,42),
  makeOffensePlayer("rb23","Special Teams Steve","RB",40,44,50,40),
  makeOffensePlayer("rb24","Undrafted Ursula","RB",38,42,46,40),
];

const WR_POOL = [
  // S-tier
  makeOffensePlayer("wr1","Route Runner Rodriguez","WR",92,90,88,84),
  makeOffensePlayer("wr2","Deep Threat Davis","WR",80,84,95,78),
  makeOffensePlayer("wr3","Slot Machine Sutton","WR",88,88,82,86),
  makeOffensePlayer("wr4","YAC King Cooper","WR",78,82,90,80),
  // A-tier
  makeOffensePlayer("wr5","Hands Higgins","WR",85,92,76,82),
  makeOffensePlayer("wr6","Jump Ball Jefferson","WR",84,86,80,80),
  makeOffensePlayer("wr7","Red Zone Randy","WR",76,84,72,84),
  makeOffensePlayer("wr8","Bubble Screen Burns","WR",72,78,88,74),
  makeOffensePlayer("wr9","Drop City Adams","WR",80,68,82,70),
  makeOffensePlayer("wr10","Crisp Cutter Carlos","WR",74,80,80,76),
  makeOffensePlayer("wr11","Comeback Kid Kenny","WR",78,76,76,78),
  makeOffensePlayer("wr12","Gadget Guru Grant","WR",70,76,84,72),
  // B-tier
  makeOffensePlayer("wr13","Third String Tom","WR",64,70,74,68),
  makeOffensePlayer("wr14","Practice Squad Phil","WR",60,64,70,62),
  makeOffensePlayer("wr15","Possession Percy","WR",66,72,68,70),
  makeOffensePlayer("wr16","Special Teams Stan","WR",60,66,72,64),
  makeOffensePlayer("wr17","Blocking Blake","WR",62,60,70,62),
  makeOffensePlayer("wr18","Slot Scrub Sam","WR",58,66,68,62),
  // C-tier (avg must be < 52)
  makeOffensePlayer("wr19","Last Resort Larry","WR",46,48,50,46),
  makeOffensePlayer("wr20","Camp Body Billy","WR",44,44,48,44),
  makeOffensePlayer("wr21","Practice Padder Paul","WR",42,42,46,42),
  makeOffensePlayer("wr22","Tryout Tommy","WR",40,40,44,40),
  makeOffensePlayer("wr23","Depth Chart Derek","WR",38,38,42,38),
  makeOffensePlayer("wr24","Undrafted Ulrich","WR",36,36,40,36),
];

const TE_POOL = [
  // S-tier
  makeOffensePlayer("te1","Gronkowski Lite","TE",88,84,72,80),
  makeOffensePlayer("te2","Receiving Rex","TE",72,90,76,82),
  makeOffensePlayer("te3","Blocking Bob","TE",92,68,68,76),
  // A-tier
  makeOffensePlayer("te4","Utility Uzomah","TE",78,78,74,78),
  makeOffensePlayer("te5","Red Zone Renegade","TE",80,80,70,80),
  makeOffensePlayer("te6","Athletic Ajax","TE",74,82,78,76),
  makeOffensePlayer("te7","Seam Stretcher","TE",70,84,76,78),
  makeOffensePlayer("te8","H-Back Harry","TE",76,76,72,76),
  // B-tier
  makeOffensePlayer("te9","Backup Billy","TE",70,72,68,70),
  makeOffensePlayer("te10","Inline Ira","TE",74,66,66,68),
  makeOffensePlayer("te11","Short Route Sam","TE",64,72,66,70),
  makeOffensePlayer("te12","Fullback Fred","TE",72,64,64,66),
  makeOffensePlayer("te13","Two-Way Terrence","TE",66,68,66,66),
  makeOffensePlayer("te14","Journeyman Jake","TE",62,66,64,64),
  // C-tier (avg must be < 52)
  makeOffensePlayer("te15","Blocking Blob","TE",48,40,44,42),
  makeOffensePlayer("te16","Practice TE Pete","TE",44,44,44,44),
  makeOffensePlayer("te17","Camp Catch Carl","TE",42,46,42,42),
  makeOffensePlayer("te18","Depth Chart Don","TE",40,42,40,40),
];

const OL_POOL = [
  // S-tier
  makeOffensePlayer("ol1","Pancake Pete","OL",92,88,68,84),
  makeOffensePlayer("ol2","Pass Pro Paul","OL",78,94,70,86),
  makeOffensePlayer("ol3","Balanced Bob","OL",84,84,72,82),
  // A-tier
  makeOffensePlayer("ol4","Road Grader Ray","OL",90,76,66,78),
  makeOffensePlayer("ol5","Quick Set Quinn","OL",72,86,80,80),
  makeOffensePlayer("ol6","Drive Blocker Don","OL",86,74,68,76),
  makeOffensePlayer("ol7","Anchor Andre","OL",80,82,70,78),
  makeOffensePlayer("ol8","Athletic Al","OL",74,80,76,76),
  // B-tier
  makeOffensePlayer("ol9","Backup Blocker","OL",70,74,66,72),
  makeOffensePlayer("ol10","Mauler Mike","OL",76,68,64,68),
  makeOffensePlayer("ol11","Zone Scheme Zach","OL",66,74,68,70),
  makeOffensePlayer("ol12","Guard Gary","OL",72,70,64,68),
  makeOffensePlayer("ol13","Swing Tackle Sam","OL",68,72,66,68),
  makeOffensePlayer("ol14","Journey Man Joel","OL",64,70,64,66),
  // C-tier (avg must be < 52)
  makeOffensePlayer("ol15","Practice Line Pat","OL",46,48,44,46),
  makeOffensePlayer("ol16","Camp Body Chester","OL",44,46,42,44),
  makeOffensePlayer("ol17","Depth Line Dave","OL",42,44,40,42),
  makeOffensePlayer("ol18","Backup Bench Ben","OL",40,42,38,40),
];

const DL_POOL = [
  // S-tier
  makeDefensePlayer("dl1","Sack Master Smith","DL",92,78,84,86),
  makeDefensePlayer("dl2","Run Stopper Rogers","DL",72,92,90,82),
  makeDefensePlayer("dl3","Double Threat Davis","DL",86,86,86,84),
  // A-tier
  makeDefensePlayer("dl4","Gap Plugger Garcia","DL",68,90,92,80),
  makeDefensePlayer("dl5","Edge Rusher Edwards","DL",90,72,78,80),
  makeDefensePlayer("dl6","Pocket Collapser","DL",82,78,80,76),
  makeDefensePlayer("dl7","Nose Tackle Norm","DL",64,88,92,74),
  makeDefensePlayer("dl8","Speed Rusher Stan","DL",88,64,72,78),
  makeDefensePlayer("dl9","Bull Rush Boris","DL",84,68,82,74),
  makeDefensePlayer("dl10","Contain Corner Carl","DL",70,82,80,76),
  // B-tier
  makeDefensePlayer("dl11","Rotation Randy","DL",72,72,76,70),
  makeDefensePlayer("dl12","Average Andre","DL",68,74,74,68),
  makeDefensePlayer("dl13","Stopgap Steve","DL",64,72,72,66),
  makeDefensePlayer("dl14","Interior Ivan","DL",66,70,74,66),
  makeDefensePlayer("dl15","Spare Part Pat","DL",62,68,70,64),
  makeDefensePlayer("dl16","Depth Defender Dave","DL",60,66,68,62),
  // C-tier
  makeDefensePlayer("dl17","Practice Rush Pete","DL",56,60,64,58),
  makeDefensePlayer("dl18","Camp Body Chuck","DL",52,58,62,56),
  makeDefensePlayer("dl19","Depth Line Dan","DL",50,56,60,54),
  makeDefensePlayer("dl20","Tryout Tony","DL",48,54,58,52),
];

const LB_POOL = [
  // S-tier
  makeDefensePlayer("lb1","Blitz King Banks","LB",90,82,88,88),
  makeDefensePlayer("lb2","Coverage King Carter","LB",72,92,82,86),
  makeDefensePlayer("lb3","All-Pro Anderson","LB",84,86,88,88),
  // A-tier
  makeDefensePlayer("lb4","Run Stuffing Roberts","LB",76,78,92,84),
  makeDefensePlayer("lb5","Zone Dropper Zach","LB",68,88,80,86),
  makeDefensePlayer("lb6","Sideline-to-Sideline Sam","LB",80,80,86,82),
  makeDefensePlayer("lb7","Blitz Specialist Boris","LB",88,68,80,78),
  makeDefensePlayer("lb8","Hybrid Henry","LB",76,82,80,80),
  makeDefensePlayer("lb9","Pass Rush Pat","LB",82,70,78,76),
  makeDefensePlayer("lb10","Zone Read Zeke","LB",68,84,76,80),
  // B-tier
  makeDefensePlayer("lb11","Backup Backer","LB",70,72,78,72),
  makeDefensePlayer("lb12","Steady Steve","LB",66,74,74,70),
  makeDefensePlayer("lb13","Average Alan","LB",64,70,72,68),
  makeDefensePlayer("lb14","Rotation Ricky","LB",68,66,74,66),
  makeDefensePlayer("lb15","Spare Linebacker Lou","LB",62,68,70,64),
  makeDefensePlayer("lb16","Practice Backer Phil","LB",60,64,68,62),
  // C-tier
  makeDefensePlayer("lb17","Camp Body Clyde","LB",56,60,64,58),
  makeDefensePlayer("lb18","Tryout Tim","LB",52,58,62,56),
  makeDefensePlayer("lb19","Depth Dave","LB",50,56,60,54),
  makeDefensePlayer("lb20","Fourth Stringer Frank","LB",48,54,58,52),
];

const CB_POOL = [
  // S-tier
  makeDefensePlayer("cb1","Shutdown Sherman","CB",80,94,80,90),
  makeDefensePlayer("cb2","Press Corner Pete","CB",90,86,76,84),
  makeDefensePlayer("cb3","Ball Hawk Hayes","CB",74,90,78,92),
  // A-tier
  makeDefensePlayer("cb4","Slot Corner Stu","CB",76,88,80,86),
  makeDefensePlayer("cb5","Sticky Coverage Steve","CB",72,92,76,88),
  makeDefensePlayer("cb6","Nickel Norman","CB",70,84,74,82),
  makeDefensePlayer("cb7","Trail Tech Terry","CB",74,82,76,80),
  makeDefensePlayer("cb8","Mirror Man Marcus","CB",72,86,72,82),
  makeDefensePlayer("cb9","Zone Drifter Zane","CB",68,84,74,80),
  makeDefensePlayer("cb10","Press N Pray Paulo","CB",82,74,72,76),
  // B-tier
  makeDefensePlayer("cb11","Corner-back Carl","CB",66,80,72,78),
  makeDefensePlayer("cb12","Backup Corner","CB",62,74,68,72),
  makeDefensePlayer("cb13","Average Alex","CB",60,72,66,70),
  makeDefensePlayer("cb14","Rotation Rico","CB",64,70,66,68),
  makeDefensePlayer("cb15","Dime Back Danny","CB",58,72,64,68),
  makeDefensePlayer("cb16","Depth Corner Derek","CB",56,68,62,66),
  // C-tier
  makeDefensePlayer("cb17","Practice Corner Phil","CB",52,64,60,62),
  makeDefensePlayer("cb18","Camp Body Chester","CB",50,60,58,60),
  makeDefensePlayer("cb19","Tryout Travis","CB",48,58,56,58),
  makeDefensePlayer("cb20","Fourth String Floyd","CB",46,56,54,56),
];

const S_POOL = [
  // S-tier
  makeDefensePlayer("s1","Zone Hawk Zavala","S",78,92,82,90),
  makeDefensePlayer("s2","Box Safety Banks","S",84,80,90,86),
  makeDefensePlayer("s3","All-World Atkins","S",80,88,84,88),
  // A-tier
  makeDefensePlayer("s4","Free Safety Frank","S",72,90,80,88),
  makeDefensePlayer("s5","Strong Safety Steve","S",82,82,88,84),
  makeDefensePlayer("s6","Rangy Reed","S",70,86,80,88),
  makeDefensePlayer("s7","Center Field Cedric","S",68,88,76,86),
  makeDefensePlayer("s8","Run Support Roy","S",80,76,86,80),
  makeDefensePlayer("s9","Hybrid Hunter","S",74,82,80,82),
  makeDefensePlayer("s10","Range Rover Ricky","S",70,84,78,82),
  // B-tier
  makeDefensePlayer("s11","Backup Safety","S",66,78,74,78),
  makeDefensePlayer("s12","Steady Sam","S",62,74,72,74),
  makeDefensePlayer("s13","Average Andrew","S",60,72,70,72),
  makeDefensePlayer("s14","Rotation Ralph","S",64,70,72,70),
  makeDefensePlayer("s15","Depth Safety Doug","S",58,70,68,68),
  makeDefensePlayer("s16","Practice Pat","S",56,66,66,66),
  // C-tier
  makeDefensePlayer("s17","Camp Body Calvin","S",52,62,62,62),
  makeDefensePlayer("s18","Tryout Tyler","S",50,60,60,60),
  makeDefensePlayer("s19","Fourth Stringer Felix","S",48,58,58,58),
  makeDefensePlayer("s20","Undrafted Ulysses","S",46,56,56,56),
];

const ALL_OFFENSE = [...QB_POOL, ...RB_POOL, ...WR_POOL, ...TE_POOL, ...OL_POOL];
const ALL_DEFENSE = [...DL_POOL, ...LB_POOL, ...CB_POOL, ...S_POOL];
const ALL_PLAYERS = [...ALL_OFFENSE, ...ALL_DEFENSE];

// ─── PLAY TYPES ──────────────────────────────────────────────────────────────
const OFFENSE_PLAYS = [
  { id:"run",        label:"Run",          icon:"🏃", desc:"Power the ball forward",        offStat:"primary",   defCounters:["blitz","man"] },
  { id:"short_pass", label:"Short Pass",   icon:"🎯", desc:"Quick underneath throws",       offStat:"secondary", defCounters:["zone","cover2"] },
  { id:"deep_pass",  label:"Deep Pass",    icon:"🚀", desc:"Take a shot downfield",         offStat:"primary",   defCounters:["man","spy"] },
  { id:"screen",     label:"Screen Pass",  icon:"🕸️", desc:"Catch blitz, beat zone",       offStat:"speed",     defCounters:["blitz","zone"] },
  { id:"option",     label:"Option/RPO",   icon:"🔀", desc:"QB reads and attacks gaps",     offStat:"awareness", defCounters:["man","spy"] },
];

// Scheme matrix design:
// Blitz    → weak vs Run, Screen        (punished by plays that exploit overaggression)
// Zone     → weak vs Deep Pass, Screen  (deep routes stretch zones; screens attack underneath)
// Man      → weak vs Deep Pass, Option  (man can't handle speed/misdirection)
// Cover 2  → weak vs Run, Short Pass    (soft underneath; no help stopping runs)
// QB Spy   → weak vs Short Pass, Screen (spy is wasted vs quick/horizontal plays)
const DEFENSE_PLAYS = [
  { id:"blitz",   label:"Blitz",    icon:"⚡", desc:"Send extra rushers",          defStat:"pass_rush", strongVs:["deep_pass","option"],    weakVs:["run","screen"] },
  { id:"zone",    label:"Zone",     icon:"🌐", desc:"Cover areas of the field",    defStat:"coverage",  strongVs:["run","option"],          weakVs:["deep_pass","screen"] },
  { id:"man",     label:"Man",      icon:"👁️", desc:"1-on-1 coverage",             defStat:"coverage",  strongVs:["short_pass","screen"],   weakVs:["deep_pass","option"] },
  { id:"cover2",  label:"Cover 2",  icon:"🛡️", desc:"Two deep safeties",           defStat:"coverage",  strongVs:["deep_pass","short_pass"],weakVs:["run","short_pass"] },
  { id:"spy",     label:"QB Spy",   icon:"🕵️", desc:"Contain mobile QB",           defStat:"instinct",  strongVs:["run","option"],          weakVs:["short_pass","screen"] },
];

const TIER_COLOR = { S:"#f59e0b", A:"#60a5fa", B:"#34d399", C:"#94a3b8" };

// ─── DRAFT CONFIG ─────────────────────────────────────────────────────────────
// Human picks 8 players (2S+3A+3B), C-tier auto-fills the rest
// Required: 1 QB, 2 RB, 3 WR, 1 TE, 1 OL → offense (8 active)
//           2 DL, 2 LB, 2 CB, 1 S        → defense (7 active)
const DRAFT_TIER_LIMITS = { S:2, A:3, B:3, C:0 };
const DRAFT_PICKS = 8;
const FULL_OFFENSE = 8; // QB+RB+RB+WR+WR+WR+TE+OL
const FULL_DEFENSE = 7; // DL+DL+LB+LB+CB+CB+S

// Gauntlet mode: offense-only draft, lighter tier limits, rest auto-filled with C
const GAUNTLET_TIER_LIMITS = { S:1, A:2, B:2, C:0 };
const GAUNTLET_PICKS = 5; // 1S + 2A + 2B = 5 active picks, rest C-tier auto-fill
const GAUNTLET_FULL_OFFENSE = 11; // QB+RB+RB+WR+WR+WR+TE+OL+OL+OL+OL

// Ideal starting lineup template
const OFF_LINEUP_SLOTS = ["QB","RB","RB","WR","WR","WR","TE","OL"];
const DEF_LINEUP_SLOTS = ["DL","DL","LB","LB","CB","CB","S"];
const GAUNTLET_OFF_SLOTS = ["QB","RB","RB","WR","WR","WR","TE","OL","OL","OL","OL"];

// ─── SUPABASE ONLINE ──────────────────────────────────────────────────────────
const SUPABASE_URL = "https://ilkdmydpukdfdorxeekh.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imlsa2RteWRwdWtkZmRvcnhlZWtoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQyOTUyNzMsImV4cCI6MjA5OTg3MTI3M30.ISx1pjxLeKyfBpvJBvcxIY9xPFBVtPxUTl9W99OrB24";
const supaHeaders = {
  apikey: SUPABASE_KEY,
  Authorization: `Bearer ${SUPABASE_KEY}`,
  "Content-Type": "application/json",
};
const supa = {
  async getRoom(code) {
    try {
      const r = await fetch(`${SUPABASE_URL}/rest/v1/rooms?code=eq.${encodeURIComponent(code)}&select=state`, { headers: supaHeaders });
      const rows = await r.json();
      return rows?.[0]?.state || null;
    } catch(e) { return null; }
  },
  async upsertRoom(code, state) {
    try {
      await fetch(`${SUPABASE_URL}/rest/v1/rooms`, {
        method: "POST",
        headers: { ...supaHeaders, Prefer: "resolution=merge-duplicates" },
        body: JSON.stringify({ code, state }),
      });
    } catch(e) {}
  },
};
function generateRoomCode() { return Math.random().toString(36).slice(2,7).toUpperCase(); }

// ─── SOUND ────────────────────────────────────────────────────────────────────
const AudioCtx = typeof window !== "undefined" && (window.AudioContext || window.webkitAudioContext);
let _soundEnabled = true;
function playSound(type) {
  if (!AudioCtx || !_soundEnabled) return;
  try {
    const ctx = new AudioCtx();
    const master = ctx.createGain(); master.gain.value = 0.3; master.connect(ctx.destination);
    const play = (freq, dur, wave="sine", vol=1, t=0, freqEnd=null) => {
      const osc = ctx.createOscillator(); const g = ctx.createGain();
      osc.connect(g); g.connect(master); osc.type = wave;
      osc.frequency.setValueAtTime(freq, ctx.currentTime+t);
      if(freqEnd) osc.frequency.linearRampToValueAtTime(freqEnd, ctx.currentTime+t+dur);
      g.gain.setValueAtTime(vol, ctx.currentTime+t);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime+t+dur);
      osc.start(ctx.currentTime+t); osc.stop(ctx.currentTime+t+dur+0.01);
    };
    if(type==="first_down") { play(660,0.12,"sine",0.8); play(880,0.18,"sine",0.6,0.1); play(1100,0.2,"sine",0.5,0.2); }
    else if(type==="touchdown") { [0,.12,.22,.32,.42,.5].forEach((t,i)=>{ const f=[523,659,784,1047,1319,1568][i]; play(f,0.22,"sine",0.7,t); }); }
    else if(type==="turnover") { play(400,0.18,"sawtooth",0.8,0,120); play(180,0.3,"sine",0.5,0.1,60); }
    else if(type==="sack") { play(200,0.12,"sawtooth",1.0,0,80); play(120,0.2,"sine",0.6,0.08); }
    else if(type==="big_gain") { play(500,0.1,"sine",0.7); play(700,0.15,"sine",0.5,0.08); }
    else if(type==="loss") { play(300,0.15,"sawtooth",0.6,0,150); }
    else if(type==="dice") { [0,.06,.12,.18,.24].forEach(t=>play(600+Math.random()*400,0.04,"square",0.25,t)); }
    else if(type==="punt") { play(300,0.08,"sine",0.5); play(200,0.2,"sine",0.4,0.1,100); }
    else if(type==="fg") { play(660,0.15,"sine",0.7); play(880,0.2,"sine",0.5,0.12); play(1100,0.25,"sine",0.4,0.22); }
    setTimeout(()=>ctx.close(),2500);
  } catch(e) {}
}

// ─── DICE ENGINE ─────────────────────────────────────────────────────────────
function statToWeights(stat) {
  const delta = (stat - 70) / 100;
  return Array.from({length:6}, (_,i) => Math.max(0.05, 1 + (i - 2.5) * delta * 1.4));
}
function weightedD6(weights) {
  const total = weights.reduce((a,b)=>a+b,0); let r = Math.random()*total;
  for(let i=0;i<6;i++) { r-=weights[i]; if(r<=0) return i+1; } return 6;
}

// Resolve a play:
// net = offRoll - defRoll + luckMod
// Yards gained by play type and net:
//   run:        net>=4:+8 | 3:+5 | 2:+3 | 1:+1 | 0:-1 | -1:-3 | <=-2:fumble
//   short_pass: net>=4:+12| 3:+8 | 2:+5 | 1:+2 | 0:inc| -1:inc | <=-2:INT
//   deep_pass:  net>=5:+35| 4:+25| 3:+15| 2:+8 | 1:+3 | 0:inc  | <=-1:INT
//   screen:     net>=3:+10| 2:+6 | 1:+3 | 0:0  | <=-1:-2 (no fumble/INT on screen)
//   option:     net>=4:+10| 3:+6 | 2:+4 | 1:+2 | 0:-1 | <=-1:-4:sack
// Scheme matchup bonus: if offense play is in def.weakVs → off +2 net bonus
// Scheme matchup penalty: if offense play is in def.strongVs → off -2 net penalty

function resolvePlay(offPlay, defPlay, offRoster, defRoster, playGuess, gameState) {
  const offPlayDef = OFFENSE_PLAYS.find(p=>p.id===offPlay);
  const defPlayDef = DEFENSE_PLAYS.find(p=>p.id===defPlay);

  // Pick relevant players
  const qb = offRoster.starters.find(p=>p.pos==="QB");
  const rbs = offRoster.starters.filter(p=>p.pos==="RB");
  const wrs = offRoster.starters.filter(p=>p.pos==="WR");
  const te = offRoster.starters.find(p=>p.pos==="TE");
  const ol = offRoster.starters.find(p=>p.pos==="OL");
  const dls = defRoster.starters.filter(p=>p.pos==="DL");
  const lbs = defRoster.starters.filter(p=>p.pos==="LB");
  const cbs = defRoster.starters.filter(p=>p.pos==="CB");
  const s = defRoster.starters.find(p=>p.pos==="S");

  // Offense stat: varies by play
  let offStat = 70, offStatName = "", keyOffPlayer = qb;
  if(offPlay==="run") {
    const rb = rbs[0]; offStat = rb ? rb.primary : 70; offStatName = "PWR"; keyOffPlayer = rb;
    const olBonus = ol ? Math.round((ol.primary + ol.secondary)/2 - 70) : 0;
    offStat = Math.min(99, offStat + Math.round(olBonus * 0.4));
  } else if(offPlay==="short_pass") {
    offStat = qb ? Math.round((qb.secondary + qb.awareness)/2) : 70; offStatName = "ACC";
    const wrBonus = wrs.length ? Math.round(wrs[0].secondary - 70) : 0;
    offStat = Math.min(99, offStat + Math.round(wrBonus * 0.3));
  } else if(offPlay==="deep_pass") {
    offStat = qb ? Math.round((qb.primary * 0.6 + (wrs[0]?.speed||70) * 0.4)) : 70; offStatName = "ARM";
    keyOffPlayer = wrs[0] || qb;
    // OL pass blocking: up to +8 boost on deep pass (clean pocket = QB can step into throws)
    const olPassBonus = ol ? Math.round((ol.secondary - 70) * 0.25) : 0;
    offStat = Math.min(99, offStat + olPassBonus);
  } else if(offPlay==="screen") {
    const rb = rbs[0]; offStat = rb ? Math.round((rb.secondary + rb.speed)/2) : 70; offStatName = "ELU"; keyOffPlayer = rb;
    // OL run blocking: up to +8 boost on screen (OL sets the wall for the screen to develop)
    const olRunBonus = ol ? Math.round((ol.primary - 70) * 0.25) : 0;
    offStat = Math.min(99, offStat + olRunBonus);
  } else if(offPlay==="option") {
    offStat = qb ? Math.round((qb.awareness * 0.5 + qb.speed * 0.5)) : 70; offStatName = "IQ"; keyOffPlayer = qb;
  }

  // Defense stat
  let defStat = 70, defStatName = "", keyDefPlayer = lbs[0] || dls[0];
  if(defPlay==="blitz") {
    const allRushers = [...dls, ...lbs]; const topRusher = [...allRushers].sort((a,b)=>b.pass_rush-a.pass_rush)[0];
    defStat = topRusher ? topRusher.pass_rush : 70; defStatName = "RUSH"; keyDefPlayer = topRusher;
  } else if(defPlay==="zone") {
    const allCov = [...cbs, ...lbs, ...(s ? [s] : [])];
    const avgCov = allCov.length ? Math.round(allCov.reduce((acc,p)=>acc+p.coverage,0)/allCov.length) : 70;
    defStat = avgCov; defStatName = "ZON"; keyDefPlayer = cbs[0];
  } else if(defPlay==="man") {
    const topCB = [...cbs].sort((a,b)=>b.coverage-a.coverage)[0];
    defStat = topCB ? topCB.coverage : 70; defStatName = "MAN"; keyDefPlayer = topCB;
  } else if(defPlay==="cover2") {
    const safetyStat = s ? s.coverage : 70; const cbAvg = cbs.length ? Math.round(cbs.reduce((acc,p)=>acc+p.coverage,0)/cbs.length) : 70;
    defStat = Math.round((safetyStat + cbAvg) / 2); defStatName = "CVR"; keyDefPlayer = s;
  } else if(defPlay==="spy") {
    const spyLB = [...lbs].sort((a,b)=>b.instinct-a.instinct)[0];
    defStat = spyLB ? spyLB.instinct : 70; defStatName = "SPY"; keyDefPlayer = spyLB;
  }

  // Scheme matchup
  const isWeakVs = defPlayDef?.weakVs?.includes(offPlay);
  const isStrongVs = defPlayDef?.strongVs?.includes(offPlay);
  const schemeBonus = isWeakVs ? 2 : isStrongVs ? -2 : 0;
  const safeSchemeBonus = isNaN(schemeBonus) ? 0 : schemeBonus;
  const schemeLabel = isWeakVs ? "📖 Play broke the scheme! +2 net" : isStrongVs ? "🛡️ Defense had the right call! -2 net" : null;

  // Play guess bonus (offense guesses what defense will call)
  const guessCorrect = playGuess && playGuess === defPlay;
  const guessWrong = playGuess && playGuess !== defPlay;
  const guessBonusVal = guessCorrect ? 6 : guessWrong ? -3 : 0;
  const adjustedOffStat = Math.min(99, Math.max(10, offStat + guessBonusVal * 3));

  const offWeights = statToWeights(adjustedOffStat);
  const defWeights = statToWeights(defStat);
  const offRoll = weightedD6(offWeights);
  const defRoll = weightedD6(defWeights);
  const luckRoll = weightedD6([1,1,1,1,1,1]);
  const luckMod = luckRoll >= 5 ? 1 : luckRoll <= 2 ? -1 : 0;
  const net = offRoll - defRoll + luckMod + safeSchemeBonus;

  // Determine result
  let yards = 0, special = null; // special: "touchdown"|"fumble"|"interception"|"sack"

  if(offPlay==="run") {
    if(net>=4) yards=8; else if(net===3) yards=5; else if(net===2) yards=3;
    else if(net===1) yards=1; else if(net===0) yards=-1; else if(net===-1) yards=-3;
    else if(net===-2) yards=-4; else if(net===-3) yards=-5;
    else { yards=-5; special="fumble"; } // only at net <= -4
  } else if(offPlay==="short_pass") {
    if(net>=4) yards=12; else if(net===3) yards=8; else if(net===2) yards=5;
    else if(net===1) yards=2; else if(net===0) yards=0; else if(net===-1) yards=0;
    else if(net===-2) yards=0; else if(net===-3) yards=0; else if(net===-4) yards=0;
    else { yards=0; special="interception"; } // only at net <= -5
  } else if(offPlay==="deep_pass") {
    if(net>=5) yards=40; else if(net===4) yards=28; else if(net===3) yards=18;
    else if(net===2) yards=10; else if(net===1) yards=4; else if(net===0) yards=0;
    else if(net===-1) yards=0; else if(net===-2) yards=0; else if(net===-3) yards=0; // incomplete
    else { yards=0; special="interception"; } // only at net <= -4
  } else if(offPlay==="screen") {
    if(net>=3) yards=10; else if(net===2) yards=6; else if(net===1) yards=3;
    else if(net===0) yards=0; else yards=-2;
  } else if(offPlay==="option") {
    if(net>=4) yards=10; else if(net===3) yards=6; else if(net===2) yards=4;
    else if(net===1) yards=2; else if(net===0) yards=-1;
    else { yards=-7; special="sack"; }
  }

  // Check for TD: if offense starting on opponent side and yards carry across goal
  const toGoTD = gameState?.yardsToTD || 100;
  if(special===null && yards >= toGoTD) { special = "touchdown"; yards = toGoTD; }

  // Sack on deep pass if deep_pass with very low net and blitz defense
  if(offPlay==="deep_pass" && defPlay==="blitz" && net <= -2 && special===null) {
    yards = -8; special = "sack";
  }

  const resultLabels = {
    touchdown: "🏆 TOUCHDOWN!",
    fumble: "💀 FUMBLE! Turnover!",
    interception: "🚨 INTERCEPTION! Turnover!",
    sack: `😱 SACK! -${Math.abs(yards)} yards`,
  };

  const yardLabel = special ? resultLabels[special] :
    yards > 15 ? `🚀 Big gain! +${yards} yards` :
    yards > 5 ? `✅ +${yards} yards` :
    yards > 0 ? `+${yards} yards` :
    yards === 0 ? "No gain / Incomplete" :
    `📉 Loss of ${Math.abs(yards)} yards`;

  return {
    offRoll, defRoll, luckRoll, luckMod, net,
    offStat, defStat, adjustedOffStat, offStatName, defStatName,
    keyOffPlayer, keyDefPlayer,
    schemeBonus: safeSchemeBonus, schemeLabel,
    guessCorrect, guessWrong, guessBonusVal,
    yards, special,
    yardLabel,
  };
}

// ─── AI PLAY CALLING ──────────────────────────────────────────────────────────
function aiPickOffensePlay(down, yardsToGo, yardsToTD, score, side, quarter, gameLog) {
  // 3rd/4th and long → deep pass more likely
  // 3rd/4th and short → run or screen
  // Behind late → deep pass more likely
  // Red zone (<20 yards to TD) → prefer run/short
  const deficit = score[side==="away"?"home":"away"] - score[side];
  const isRedZone = yardsToTD <= 20;
  const isLong = yardsToGo >= 8;
  const isShort = yardsToGo <= 3;
  const isLate = quarter >= 4;
  const options = [];
  if(isRedZone) { options.push("run","run","short_pass","short_pass","option"); }
  else if(isLong) { options.push("deep_pass","deep_pass","short_pass","screen"); }
  else if(isShort) { options.push("run","run","run","option","short_pass"); }
  else { options.push("run","short_pass","short_pass","deep_pass","screen","option"); }
  if(deficit >= 14 && isLate) { options.push("deep_pass","deep_pass"); }
  if(deficit <= -14 && isLate) { options.push("run","run"); }
  return options[Math.floor(Math.random()*options.length)];
}

function aiPickDefensePlay(lastOffPlay, down, yardsToGo, score, side, quarter) {
  const deficit = score[side==="away"?"home":"away"] - score[side];
  // Counter last play pattern
  const options = [];
  if(lastOffPlay==="run") options.push("blitz","man","blitz");
  else if(lastOffPlay==="deep_pass") options.push("zone","cover2","man");
  else if(lastOffPlay==="screen") options.push("man","zone");
  else if(lastOffPlay==="option") options.push("spy","spy","blitz");
  else options.push("zone","cover2","man","blitz","spy");
  // Extra pressure when winning late
  if(deficit<=-10 && quarter>=4) options.push("blitz","blitz");
  options.push(...["blitz","zone","man","cover2","spy"]);
  return options[Math.floor(Math.random()*options.length)];
}

// ─── GAME STATE ───────────────────────────────────────────────────────────────
function initGame() {
  return {
    mode: null, phase: "menu",
    quarter: 1, gameClock: 900, // 15 min quarters in seconds
    possession: "away", // who has the ball
    score: { away: 0, home: 0 },
    teams: { away: "Visitors", home: "Home" },
    teamColors: { away: TEAM_PALETTE[0], home: TEAM_PALETTE[1] },
    playerSide: "away",
    playerRoster: { starters: [], bench: [] },
    aiRoster: { starters: [], bench: [] },
    // Current drive
    fieldPosition: 25, // yards from OWN goal line (25 = own 25-yard line)
    down: 1,
    yardsToGo: 10,
    driveLog: [],
    gameLog: [],
    // Play calling
    offensePlay: null,
    defensePlay: null,
    playGuess: null,
    lastResult: null,
    lastDice: null,
    // Draft
    draftPool: [],
    draftPick: 0,
    draftOptions: [],
    _playoffDraft: false,
  };
}

// ─── HELPERS ─────────────────────────────────────────────────────────────────
function yardsToTD(fieldPosition) { return 100 - fieldPosition; } // yards from own goal

function buildDraftPool() {
  const overall = p => p.side==="offense" ? (p.primary+p.secondary+p.speed+p.awareness)/4 : (p.pass_rush+p.coverage+p.tackle+p.instinct)/4;
  // Generous caps so 2+ teams always have enough players to draft + auto-fill from
  // Each team drafts 8 active (2S+3A+3B) and auto-fills ~7 more C-tier
  // So pool needs: ≥8 S, ≥12 A, ≥12 B, ≥20 C (for 2 teams with buffer)
  const CAPS = { S:16, A:24, B:24, C:40 };
  const cnt = {S:0,A:0,B:0,C:0};
  // Use all players — pool is large enough now
  const all = [...ALL_PLAYERS].sort((a,b)=>overall(b)-overall(a));
  const picked = [];
  for(const p of all) {
    if(cnt[p.tier]<CAPS[p.tier]) { picked.push(p); cnt[p.tier]++; }
  }
  return picked.sort((a,b)=>overall(b)-overall(a));
}

// Gauntlet-specific pool: offense only with guaranteed C-tier depth per position
function buildGauntletDraftPool() {
  const overall = p => (p.primary+p.secondary+p.speed+p.awareness)/4;
  const POS_CAPS = {
    QB: {S:4,A:4,B:4,C:8},
    RB: {S:4,A:4,B:4,C:8},
    WR: {S:4,A:4,B:4,C:8},
    TE: {S:3,A:3,B:3,C:6},
    OL: {S:3,A:3,B:3,C:8},
  };
  const cnt = {};
  Object.keys(POS_CAPS).forEach(pos=>{ cnt[pos]={S:0,A:0,B:0,C:0}; });
  const all = [...ALL_OFFENSE].sort((a,b)=>overall(b)-overall(a));
  const picked = [];
  for(const p of all) {
    const caps = POS_CAPS[p.pos];
    if(!caps) continue;
    if(cnt[p.pos][p.tier] < caps[p.tier]) { picked.push(p); cnt[p.pos][p.tier]++; }
  }
  return picked.sort((a,b)=>overall(b)-overall(a));
}


function rosterTierCount(starters) {
  const cnt = {S:0,A:0,B:0,C:0};
  starters.forEach(p=>{ if(cnt[p.tier]!==undefined) cnt[p.tier]++; });
  return cnt;
}

function buildDraftOptions(pool, takenIds, needOff, needDef, tierCount={}, count=3, gauntletMode=false) {
  const limits = gauntletMode ? GAUNTLET_TIER_LIMITS : DRAFT_TIER_LIMITS;
  const avail = pool.filter(p => {
    if(takenIds.includes(p.id)) return false;
    if(p.side==="offense" && !needOff) return false;
    if(p.side==="defense" && !needDef) return false;
    if(gauntletMode && p.side==="defense") return false; // gauntlet: offense only
    const limit = limits[p.tier] ?? 0;
    if(limit===0) return false;
    if((tierCount[p.tier]||0)>=limit) return false;
    return true;
  });
  const shuffled = [...avail].sort(()=>Math.random()-0.5);
  const off = shuffled.filter(p=>p.side==="offense");
  const def = shuffled.filter(p=>p.side==="defense");
  const result = []; const seen = new Set();
  const add = p => { if(!seen.has(p.id)){seen.add(p.id);result.push(p);} };
  if(!gauntletMode && needOff && needDef && off.length && def.length) { add(off[0]); add(def[0]); }
  for(const p of shuffled) { if(result.length>=count) break; add(p); }
  return result;
}

function autoFillRoster(starters, pool, takenIds, needOff, needDef) {
  const overall = p => p.side==="offense" ? (p.primary+p.secondary+p.speed+p.awareness)/4 : (p.pass_rush+p.coverage+p.tackle+p.instinct)/4;
  const avail = pool.filter(p=>!takenIds.includes(p.id)&&p.tier==="C").sort((a,b)=>overall(b)-overall(a));
  const result = [...starters];
  const defCount = starters.filter(p=>p.side==="defense").length;
  let defNeeded = needDef - defCount;

  // For gauntlet (needDef===0), enforce exact positional counts: 1QB 2RB 3WR 1TE 4OL
  if(needDef===0) {
    const REQUIRED = {QB:1,RB:2,WR:3,TE:1,OL:4};
    const have = {QB:0,RB:0,WR:0,TE:0,OL:0};
    starters.filter(p=>p.side==="offense").forEach(p=>{ if(have[p.pos]!==undefined) have[p.pos]++; });
    const needed = {};
    Object.keys(REQUIRED).forEach(pos=>{ needed[pos]=Math.max(0,REQUIRED[pos]-have[pos]); });
    // Fill each position from C-tier pool in order
    for(const pos of ["QB","RB","WR","TE","OL"]) {
      let n = needed[pos];
      for(const p of avail) {
        if(n<=0) break;
        if(p.pos===pos && !result.find(r=>r.id===p.id)) { result.push(p); n--; }
      }
    }
    return result;
  }

  // Normal mode: fill by side count
  const offCount = starters.filter(p=>p.side==="offense").length;
  let offNeeded = needOff - offCount;
  for(const p of avail) {
    if(offNeeded<=0 && defNeeded<=0) break;
    if(p.side==="offense" && offNeeded>0) { result.push(p); offNeeded--; }
    else if(p.side==="defense" && defNeeded>0) { result.push(p); defNeeded--; }
  }
  return result;
}

function buildAIRoster(pool, takenIds) {
  const overall = p => p.side==="offense" ? (p.primary+p.secondary+p.speed+p.awareness)/4 : (p.pass_rush+p.coverage+p.tackle+p.instinct)/4;
  const avail = pool.filter(p=>!takenIds.includes(p.id)).sort((a,b)=>overall(b)-overall(a));
  const off = []; const def = [];
  for(const p of avail) {
    if(off.length>=FULL_OFFENSE && def.length>=FULL_DEFENSE) break;
    if(p.side==="offense" && off.length<FULL_OFFENSE) off.push(p);
    else if(p.side==="defense" && def.length<FULL_DEFENSE) def.push(p);
  }
  return { starters: [...off,...def], bench: [] };
}

function draftPickOwner(idx) { const r=Math.floor(idx/2); return (r%2===0)?idx%2:1-idx%2; }

// ─── STAT DISPLAY ─────────────────────────────────────────────────────────────
function StatBar({value, color="#3b82f6"}) {
  return <div style={{height:4,borderRadius:2,background:"#1a2236",overflow:"hidden"}}>
    <div style={{height:"100%",width:`${Math.min(100,value)}%`,background:`linear-gradient(90deg,${color}cc,${color})`,borderRadius:2}}/>
  </div>;
}
function TierBadge({tier}) {
  const c=TIER_COLOR[tier]||"#94a3b8";
  return <span style={{background:c+"22",border:`1px solid ${c}88`,color:c,borderRadius:4,padding:"1px 7px",fontSize:10,fontWeight:900,letterSpacing:1}}>{tier}</span>;
}

function PlayerCard({player, selected, onClick, disabled, accent="#3b82f6"}) {
  const isOff = player.side==="offense";
  return (
    <div onClick={disabled?undefined:onClick} style={{background:selected?"#0f2744":"#111827",border:`1.5px solid ${selected?accent:disabled?"#0f172a":"#1e293b"}`,borderRadius:10,padding:"10px 12px",cursor:disabled?"default":"pointer",opacity:disabled?0.4:1,transition:"all 0.15s"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:6}}>
        <div><div style={{fontWeight:700,fontSize:13,color:"#f8fafc"}}>{player.name}</div><div style={{fontSize:11,color:"#64748b",marginTop:1}}>{player.pos} · {isOff?"Offense":"Defense"}</div></div>
        <TierBadge tier={player.tier}/>
      </div>
      {isOff ? (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4px 12px"}}>
          {[["PRI",player.primary,"#60a5fa"],["SEC",player.secondary,"#E63946"],["SPD",player.speed,"#E9C46A"],["AWR",player.awareness,"#2A9D8F"]].map(([l,v,c])=>(
            <div key={l}><div style={{display:"flex",justifyContent:"space-between",marginBottom:1}}><span style={{fontSize:9,color:"#64748b"}}>{l}</span><span style={{fontSize:9,color:"#94a3b8"}}>{v}</span></div><StatBar value={v} color={c}/></div>
          ))}
        </div>
      ) : (
        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:"4px 12px"}}>
          {[["RUSH",player.pass_rush,"#E63946"],["COV",player.coverage,"#60a5fa"],["TCK",player.tackle,"#34d399"],["INS",player.instinct,"#f59e0b"]].map(([l,v,c])=>(
            <div key={l}><div style={{display:"flex",justifyContent:"space-between",marginBottom:1}}><span style={{fontSize:9,color:"#64748b"}}>{l}</span><span style={{fontSize:9,color:"#94a3b8"}}>{v}</span></div><StatBar value={v} color={c}/></div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── DICE FACE ────────────────────────────────────────────────────────────────
const DOT_POS = {1:[[50,50]],2:[[25,25],[75,75]],3:[[25,25],[50,50],[75,75]],4:[[25,25],[75,25],[25,75],[75,75]],5:[[25,25],[75,25],[50,50],[25,75],[75,75]],6:[[25,25],[75,25],[25,50],[75,50],[25,75],[75,75]]};
function DiceFace({value,color="#f8fafc",bg="#1e293b",size=52,rolling=false}) {
  const dots=DOT_POS[Math.min(6,Math.max(1,value))]||DOT_POS[1];
  const r=size*0.09;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" style={{filter:rolling?"blur(1.5px)":"none",transition:"filter 0.08s",display:"block"}}>
      <rect x="4" y="4" width="92" height="92" rx="18" fill={bg} stroke={color} strokeWidth="3"/>
      {dots.map(([cx,cy],i)=><circle key={i} cx={cx} cy={cy} r={r*100/size} fill={color}/>)}
    </svg>
  );
}

// ─── FIELD VISUALIZER ─────────────────────────────────────────────────────────
function FieldVisualizer({fieldPosition, possession, side, teamColors}) {
  // fieldPosition = yards from offense's own goal (0–100)
  // Ball is at fieldPosition yards from left (own goal)
  const ballPct = fieldPosition / 100;
  const ownColor = teamColors[possession]?.primary || "#E63946";
  const oppColor = teamColors[possession==="away"?"home":"away"]?.primary || "#3b82f6";

  return (
    <div style={{position:"relative",height:44,borderRadius:6,overflow:"hidden",border:"1px solid #1e293b",marginBottom:4}}>
      {/* Grass */}
      <div style={{position:"absolute",inset:0,background:"linear-gradient(180deg,#1a4a1a,#1f5a1f)"}}/>
      {/* Yard lines */}
      {[10,20,30,40,50,60,70,80,90].map(y=>(
        <div key={y} style={{position:"absolute",left:`${y}%`,top:0,bottom:0,width:1,background:"rgba(255,255,255,0.15)"}}/>
      ))}
      {/* End zones */}
      <div style={{position:"absolute",left:0,top:0,bottom:0,width:"10%",background:ownColor+"55",borderRight:`2px solid ${ownColor}88`}}/>
      <div style={{position:"absolute",right:0,top:0,bottom:0,width:"10%",background:oppColor+"55",borderLeft:`2px solid ${oppColor}88`}}/>
      {/* Hash marks */}
      {[10,20,30,40,50,60,70,80,90].map(y=>(
        <div key={y} style={{position:"absolute",left:`${y}%`,top:"40%",height:4,width:1,background:"rgba(255,255,255,0.3)"}}/>
      ))}
      {/* 50-yard line label */}
      <div style={{position:"absolute",left:"50%",top:2,transform:"translateX(-50%)",fontSize:8,color:"rgba(255,255,255,0.5)",fontWeight:700}}>50</div>
      {/* Ball marker */}
      <div style={{
        position:"absolute",
        left:`${Math.min(95,Math.max(5,ballPct*100))}%`,
        top:"50%",transform:"translate(-50%,-50%)",
        width:12,height:12,borderRadius:"50%",
        background:ownColor,border:"2px solid #fff",
        boxShadow:`0 0 6px ${ownColor}`,
        zIndex:2,
      }}/>
      {/* Down & distance label */}
      <div style={{position:"absolute",right:6,bottom:3,fontSize:9,color:"rgba(255,255,255,0.7)",fontWeight:700}}>
        {possession==="away"?teamColors.away?.primary&&"→":"←"} {possession==="away"?"↗":"↙"}
      </div>
    </div>
  );
}

// ─── TEAM LOGOS ──────────────────────────────────────────────────────────────
// Deterministic SVG logo per team name — each gets a unique geometric mark
const LOGO_SHAPES = {
  "Bulldogs":    (c,s)=>`<circle cx="50" cy="50" r="36" fill="${c}" stroke="${s}" stroke-width="6"/><text x="50" y="62" text-anchor="middle" font-size="36" font-weight="900" fill="${s}" font-family="serif">B</text>`,
  "Wildcats":    (c,s)=>`<polygon points="50,10 90,80 10,80" fill="${c}" stroke="${s}" stroke-width="5"/><text x="50" y="72" text-anchor="middle" font-size="28" font-weight="900" fill="${s}" font-family="serif">W</text>`,
  "Tigers":      (c,s)=>`<rect x="14" y="14" width="72" height="72" rx="8" fill="${c}" stroke="${s}" stroke-width="5"/><text x="50" y="66" text-anchor="middle" font-size="38" font-weight="900" fill="${s}" font-family="serif">T</text>`,
  "Eagles":      (c,s)=>`<polygon points="50,8 92,92 50,72 8,92" fill="${c}" stroke="${s}" stroke-width="5"/><text x="50" y="68" text-anchor="middle" font-size="26" font-weight="900" fill="${s}" font-family="sans-serif">E</text>`,
  "Raiders":     (c,s)=>`<polygon points="50,10 90,35 90,65 50,90 10,65 10,35" fill="${c}" stroke="${s}" stroke-width="5"/><text x="50" y="63" text-anchor="middle" font-size="28" font-weight="900" fill="${s}" font-family="sans-serif">R</text>`,
  "Panthers":    (c,s)=>`<ellipse cx="50" cy="50" rx="38" ry="42" fill="${c}" stroke="${s}" stroke-width="5"/><text x="50" y="63" text-anchor="middle" font-size="32" font-weight="900" fill="${s}" font-family="serif">P</text>`,
  "Mustangs":    (c,s)=>`<polygon points="50,8 88,30 88,70 50,92 12,70 12,30" fill="${c}" stroke="${s}" stroke-width="5"/><text x="50" y="64" text-anchor="middle" font-size="30" font-weight="900" fill="${s}" font-family="serif">M</text>`,
  "Falcons":     (c,s)=>`<polygon points="50,5 70,40 95,45 70,65 78,92 50,75 22,92 30,65 5,45 30,40" fill="${c}" stroke="${s}" stroke-width="4"/><text x="50" y="60" text-anchor="middle" font-size="22" font-weight="900" fill="${s}" font-family="sans-serif">F</text>`,
  "Warriors":    (c,s)=>`<rect x="12" y="12" width="76" height="76" rx="38" fill="${c}" stroke="${s}" stroke-width="6"/><text x="50" y="64" text-anchor="middle" font-size="30" font-weight="900" fill="${s}" font-family="serif">W</text>`,
  "Cougars":     (c,s)=>`<polygon points="50,10 85,85 15,85" fill="${c}" stroke="${s}" stroke-width="5"/><circle cx="50" cy="55" r="14" fill="${s}"/><text x="50" y="60" text-anchor="middle" font-size="14" font-weight="900" fill="${c}" font-family="sans-serif">C</text>`,
  "Trojans":     (c,s)=>`<polygon points="50,8 82,25 82,75 50,92 18,75 18,25" fill="${c}" stroke="${s}" stroke-width="5"/><line x1="50" y1="25" x2="50" y2="75" stroke="${s}" stroke-width="5"/><line x1="25" y1="50" x2="75" y2="50" stroke="${s}" stroke-width="5"/>`,
  "Rebels":      (c,s)=>`<rect x="10" y="10" width="80" height="80" rx="5" fill="${c}" stroke="${s}" stroke-width="5"/><line x1="25" y1="25" x2="75" y2="75" stroke="${s}" stroke-width="6"/><line x1="75" y1="25" x2="25" y2="75" stroke="${s}" stroke-width="6"/>`,
  "Knights":     (c,s)=>`<polygon points="50,8 90,30 90,60 50,92 10,60 10,30" fill="${c}" stroke="${s}" stroke-width="5"/><rect x="36" y="30" width="28" height="35" rx="3" fill="${s}"/>`,
  "Spartans":    (c,s)=>`<polygon points="50,5 95,50 50,95 5,50" fill="${c}" stroke="${s}" stroke-width="5"/><text x="50" y="63" text-anchor="middle" font-size="32" font-weight="900" fill="${s}" font-family="serif">S</text>`,
  "Vikings":     (c,s)=>`<polygon points="50,8 88,32 88,68 50,92 12,68 12,32" fill="${c}" stroke="${s}" stroke-width="5"/><text x="50" y="64" text-anchor="middle" font-size="30" font-weight="900" fill="${s}" font-family="serif">V</text>`,
  "Wolves":      (c,s)=>`<polygon points="50,10 90,80 10,80" fill="${c}" stroke="${s}" stroke-width="5"/><polygon points="50,30 78,75 22,75" fill="${s}"/>`,
  "Hornets":     (c,s)=>`<ellipse cx="50" cy="50" rx="30" ry="42" fill="${c}" stroke="${s}" stroke-width="5"/><line x1="20" y1="35" x2="80" y2="35" stroke="${s}" stroke-width="4"/><line x1="20" y1="50" x2="80" y2="50" stroke="${s}" stroke-width="4"/><line x1="20" y1="65" x2="80" y2="65" stroke="${s}" stroke-width="4"/>`,
  "Bears":       (c,s)=>`<circle cx="50" cy="50" r="38" fill="${c}" stroke="${s}" stroke-width="5"/><circle cx="35" cy="32" r="10" fill="${c}" stroke="${s}" stroke-width="4"/><circle cx="65" cy="32" r="10" fill="${c}" stroke="${s}" stroke-width="4"/>`,
  "Cardinals":   (c,s)=>`<polygon points="50,5 70,40 95,45 70,65 78,92 50,75 22,92 30,65 5,45 30,40" fill="${c}" stroke="${s}" stroke-width="4"/>`,
  "Rams":        (c,s)=>`<circle cx="50" cy="50" r="38" fill="${c}" stroke="${s}" stroke-width="5"/><path d="M30,35 Q20,50 30,65" fill="none" stroke="${s}" stroke-width="5" stroke-linecap="round"/><path d="M70,35 Q80,50 70,65" fill="none" stroke="${s}" stroke-width="5" stroke-linecap="round"/>`,
  "Chargers":    (c,s)=>`<polygon points="50,8 88,50 50,92 12,50" fill="${c}" stroke="${s}" stroke-width="5"/><polygon points="50,24 74,50 50,76 26,50" fill="${s}"/>`,
  "Stallions":   (c,s)=>`<polygon points="50,10 90,35 90,65 50,90 10,65 10,35" fill="${c}" stroke="${s}" stroke-width="5"/><text x="50" y="64" text-anchor="middle" font-size="32" font-weight="900" fill="${s}" font-family="serif">S</text>`,
  "Rockets":     (c,s)=>`<ellipse cx="50" cy="42" rx="22" ry="34" fill="${c}" stroke="${s}" stroke-width="5"/><polygon points="50,76 38,90 62,90" fill="${c}" stroke="${s}" stroke-width="4"/><polygon points="28,55 18,75 38,65" fill="${s}"/><polygon points="72,55 82,75 62,65" fill="${s}"/>`,
  "Braves":      (c,s)=>`<polygon points="50,5 95,50 50,95 5,50" fill="${c}" stroke="${s}" stroke-width="5"/><text x="50" y="63" text-anchor="middle" font-size="28" font-weight="900" fill="${s}" font-family="serif">B</text>`,
  "Titans":      (c,s)=>`<rect x="12" y="12" width="76" height="76" rx="6" fill="${c}" stroke="${s}" stroke-width="6"/><text x="50" y="64" text-anchor="middle" font-size="30" font-weight="900" fill="${s}" font-family="serif">T</text>`,
  "Buccaneers":  (c,s)=>`<circle cx="50" cy="50" r="38" fill="${c}" stroke="${s}" stroke-width="5"/><line x1="20" y1="50" x2="80" y2="50" stroke="${s}" stroke-width="5"/><circle cx="50" cy="50" r="12" fill="${s}"/>`,
  "Grizzlies":   (c,s)=>`<ellipse cx="50" cy="52" rx="38" ry="36" fill="${c}" stroke="${s}" stroke-width="5"/><circle cx="35" cy="28" r="12" fill="${c}" stroke="${s}" stroke-width="4"/><circle cx="65" cy="28" r="12" fill="${c}" stroke="${s}" stroke-width="4"/>`,
  "Bobcats":     (c,s)=>`<circle cx="50" cy="50" r="36" fill="${c}" stroke="${s}" stroke-width="5"/><circle cx="36" cy="35" r="9" fill="${c}" stroke="${s}" stroke-width="4"/><circle cx="64" cy="35" r="9" fill="${c}" stroke="${s}" stroke-width="4"/>`,
  "Longhorns":   (c,s)=>`<circle cx="50" cy="55" r="30" fill="${c}" stroke="${s}" stroke-width="5"/><path d="M20,40 Q10,20 35,30" fill="none" stroke="${s}" stroke-width="6" stroke-linecap="round"/><path d="M80,40 Q90,20 65,30" fill="none" stroke="${s}" stroke-width="6" stroke-linecap="round"/>`,
  "Pioneers":    (c,s)=>`<polygon points="50,8 88,32 88,68 50,92 12,68 12,32" fill="${c}" stroke="${s}" stroke-width="5"/><line x1="50" y1="20" x2="50" y2="80" stroke="${s}" stroke-width="5"/><line x1="25" y1="38" x2="75" y2="62" stroke="${s}" stroke-width="4"/><line x1="25" y1="62" x2="75" y2="38" stroke="${s}" stroke-width="4"/>`,
};

function TeamLogo({teamName, primary, secondary, size=48}) {
  const shapeFn = LOGO_SHAPES[teamName];
  if(!shapeFn) {
    // Fallback: initials in circle
    const initials = teamName.split(" ").map(w=>w[0]).join("").slice(0,2);
    return (
      <svg width={size} height={size} viewBox="0 0 100 100">
        <circle cx="50" cy="50" r="44" fill={primary} stroke={secondary} strokeWidth="6"/>
        <text x="50" y="64" textAnchor="middle" fontSize="36" fontWeight="900" fill={secondary} fontFamily="serif">{initials}</text>
      </svg>
    );
  }
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" dangerouslySetInnerHTML={{__html: shapeFn(primary, secondary)}}/>
  );
}

// ─── SHOT CLOCK ──────────────────────────────────────────────────────────────
function ShotClock({seconds, color="#f59e0b"}) {
  const pct = seconds / 10;
  const r = 16, circ = 2 * Math.PI * r;
  const dash = pct * circ;
  const urgent = seconds <= 3;
  return (
    <div style={{display:"flex",alignItems:"center",gap:5}}>
      <svg width={42} height={42} viewBox="0 0 42 42">
        <circle cx="21" cy="21" r={r} fill="#0f172a" stroke="#1e293b" strokeWidth="4"/>
        <circle cx="21" cy="21" r={r} fill="none"
          stroke={urgent?"#f87171":color} strokeWidth="4"
          strokeDasharray={`${dash} ${circ}`}
          strokeDashoffset={circ/4}
          style={{transition:"stroke-dasharray 0.9s linear"}}
          strokeLinecap="round"/>
        <text x="21" y="25" textAnchor="middle" fontSize="14" fontWeight="900"
          fill={urgent?"#f87171":color} fontFamily="monospace">{seconds}</text>
      </svg>
      {urgent&&<span style={{fontSize:10,color:"#f87171",fontWeight:700,animation:"none"}}>HURRY!</span>}
    </div>
  );
}


function Scoreboard({g, onSoundToggle, roomCode}) {
  if(!g?.teamColors?.away) return null;
  const hasBall = g.possession;
  const aC = g.teamColors.away;
  const hC = g.teamColors.home;
  const qtrLabel = g.quarter<=4 ? `Q${g.quarter}` : `OT${g.quarter-4}`;
  const mins = Math.floor(g.gameClock/60);
  const secs = String(g.gameClock%60).padStart(2,"0");

  return (
    <div style={{width:"100%",maxWidth:580,padding:"8px 10px 0",boxSizing:"border-box"}}>
      {roomCode&&(
        <div style={{display:"flex",justifyContent:"flex-end",marginBottom:3}}>
          <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:6,padding:"2px 8px",fontSize:10,color:"#475569",fontFamily:"monospace",fontWeight:700,letterSpacing:2}}>
            🔑 {roomCode}
          </div>
        </div>
      )}
      <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",alignItems:"center",gap:8,marginBottom:6}}>
        <div style={{background:hasBall==="away"?aC.primary+"22":"#111827",border:`2px solid ${hasBall==="away"?aC.primary:"#1e293b"}`,borderRadius:10,padding:"6px 10px",textAlign:"center"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4,marginBottom:2}}>
            <TeamLogo teamName={g.teams.away} primary={aC.primary} secondary={aC.secondary||"#fff"} size={20}/>
            <div style={{fontSize:9,color:"#64748b",textTransform:"uppercase",letterSpacing:1}}>{g.teams.away}{hasBall==="away"?" 🏈":""}</div>
          </div>
          <div style={{fontSize:28,fontWeight:900,color:hasBall==="away"?aC.primary:"#f8fafc",lineHeight:1}}>{g.score.away}</div>
        </div>
        <div style={{textAlign:"center"}}>
          <div style={{fontSize:14,fontWeight:900,color:"#f59e0b",letterSpacing:1}}>{qtrLabel}</div>
          <div style={{fontSize:13,fontWeight:700,color:"#94a3b8"}}>{mins}:{secs}</div>
        </div>
        <div style={{background:hasBall==="home"?hC.primary+"22":"#111827",border:`2px solid ${hasBall==="home"?hC.primary:"#1e293b"}`,borderRadius:10,padding:"6px 10px",textAlign:"center"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:4,marginBottom:2}}>
            <TeamLogo teamName={g.teams.home} primary={hC.primary} secondary={hC.secondary||"#fff"} size={20}/>
            <div style={{fontSize:9,color:"#64748b",textTransform:"uppercase",letterSpacing:1}}>{g.teams.home}{hasBall==="home"?" 🏈":""}</div>
          </div>
          <div style={{fontSize:28,fontWeight:900,color:hasBall==="home"?hC.primary:"#f8fafc",lineHeight:1}}>{g.score.home}</div>
        </div>
      </div>
      <FieldVisualizer fieldPosition={g.fieldPosition} possession={g.possession} teamColors={g.teamColors}/>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"0 2px",marginBottom:4}}>
        <div style={{fontSize:12,fontWeight:800,color:g.teamColors[g.possession]?.primary}}>
          {g.down}{g.down===1?"st":g.down===2?"nd":g.down===3?"rd":"th"} & {g.fieldPosition>=90?"Goal":g.yardsToGo} · {g.fieldPosition>50?`Opp ${100-g.fieldPosition}`:`Own ${g.fieldPosition}`}
        </div>
        <div style={{display:"flex",gap:6,alignItems:"center"}}>
          {onSoundToggle&&<button onClick={onSoundToggle.fn} style={{background:"#1e293b",border:"1px solid #334155",color:"#94a3b8",borderRadius:6,padding:"4px 8px",fontSize:11,fontWeight:700,cursor:"pointer"}}>{onSoundToggle.on?"🔊":"🔇"}</button>}
        </div>
      </div>
    </div>
  );
}


// ─── ROLLING SCREEN ───────────────────────────────────────────────────────────
function RollingScreen({g, onReveal, roomCode}) {
  const [tick,setTick]=useState(0);
  const [revealed,setRevealed]=useState(false);
  useEffect(()=>{
    if(revealed) return;
    const iv=setInterval(()=>setTick(t=>t+1),110);
    const to=setTimeout(()=>{clearInterval(iv);setRevealed(true);},950);
    return()=>{clearInterval(iv);clearTimeout(to);};
  },[]);

  const dice=g.lastDice||{offRoll:1,defRoll:1,luckRoll:1,luckMod:0,net:0};
  const offSide=g.possession;
  const defSide=offSide==="away"?"home":"away";
  const offColor=g.teamColors[offSide]?.primary||"#E63946";
  const defColor=g.teamColors[defSide]?.primary||"#3b82f6";

  const fO=revealed?dice.offRoll:(tick%6)+1;
  const fD=revealed?dice.defRoll:((tick+2)%6)+1;
  const fL=revealed?dice.luckRoll:((tick+4)%6)+1;
  const net=revealed?dice.net:null;
  const netColor=net>0?"#34d399":net<0?"#f87171":"#94a3b8";

  const root={minHeight:"100vh",background:"linear-gradient(160deg,#060d1a 0%,#0a1628 50%,#080d06 100%)",color:"#f8fafc",fontFamily:"'Inter','Segoe UI',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",paddingBottom:8,padding:"12px 0 8px"};
  const card={background:"linear-gradient(180deg,#161f2e 0%,#111827 100%)",border:"1px solid #253046",borderRadius:12,padding:14,width:"100%",maxWidth:580,boxSizing:"border-box",margin:"0 8px",boxShadow:"0 2px 12px rgba(0,0,0,0.4)"};

  return (
    <div style={root}>
      <Scoreboard g={g} roomCode={roomCode}/>
      <div style={card}>
        <div style={{textAlign:"center",marginBottom:12}}>
          <div style={{fontSize:12,fontWeight:700,color:"#64748b",textTransform:"uppercase",letterSpacing:2}}>{revealed?"Dice Settled!":"Play Developing…"}</div>
          {revealed&&dice.schemeLabel&&<div style={{marginTop:6,fontSize:12,color:"#f59e0b",background:"#f59e0b11",borderRadius:6,padding:"4px 10px",display:"inline-block"}}>{dice.schemeLabel}</div>}
        </div>
        <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:12,padding:14,marginBottom:12}}>
          <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",alignItems:"center",gap:10,marginBottom:10}}>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:9,color:offColor,textTransform:"uppercase",letterSpacing:1,marginBottom:6,fontWeight:700}}>Offense</div>
              <div style={{display:"flex",justifyContent:"center"}}><DiceFace value={fO} color={offColor} bg="#0f172a" size={56} rolling={!revealed}/></div>
              <div style={{fontSize:9,color:"#475569",marginTop:4}}>
                {dice.offStatName} {dice.adjustedOffStat??dice.offStat}
                {dice.guessBonusVal>0&&<span style={{color:"#34d399",fontWeight:700}}> (+{dice.guessBonusVal*3})</span>}
                {dice.guessBonusVal<0&&<span style={{color:"#f87171",fontWeight:700}}> ({dice.guessBonusVal*3})</span>}
              </div>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:9,color:"#f59e0b",textTransform:"uppercase",letterSpacing:1,marginBottom:8,fontWeight:700}}>Luck</div>
              <div style={{width:46,height:46,borderRadius:10,border:"2px solid #f59e0b",background:"#1a1200",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto"}}>
                <span style={{fontSize:20,fontWeight:900,color:!revealed?"#334155":dice.luckMod>0?"#34d399":dice.luckMod<0?"#f87171":"#94a3b8"}}>
                  {!revealed?"?":(dice.luckMod>0?"+1":dice.luckMod<0?"-1":" 0")}
                </span>
              </div>
              <div style={{fontSize:9,color:"#475569",marginTop:4}}>{revealed?(fL<=2?"(1-2)":fL>=5?"(5-6)":"(3-4)"):"…"}</div>
            </div>
            <div style={{textAlign:"center"}}>
              <div style={{fontSize:9,color:defColor,textTransform:"uppercase",letterSpacing:1,marginBottom:6,fontWeight:700}}>Defense</div>
              <div style={{display:"flex",justifyContent:"center"}}><DiceFace value={fD} color={defColor} bg="#0f172a" size={56} rolling={!revealed}/></div>
              <div style={{fontSize:9,color:"#475569",marginTop:4}}>{dice.defStatName} {dice.defStat}</div>
            </div>
          </div>
          <div style={{borderTop:"1px solid #1e293b",paddingTop:10,textAlign:"center"}}>
            {revealed?(
              <div style={{fontSize:13,color:"#64748b",fontFamily:"monospace"}}>
                <span style={{color:offColor,fontWeight:700}}>{dice.offRoll}</span>
                <span style={{color:"#475569"}}> (off) − </span>
                <span style={{color:defColor,fontWeight:700}}>{dice.defRoll}</span>
                <span style={{color:"#475569"}}> (def) </span>
                <span style={{color:dice.luckMod>0?"#34d399":dice.luckMod<0?"#f87171":"#475569",fontWeight:700}}>
                  {dice.luckMod>=0?"+ ":"− "}{Math.abs(dice.luckMod)}
                </span>
                {dice.schemeBonus!==0&&<span style={{color:dice.schemeBonus>0?"#34d399":"#f87171",fontWeight:700}}> {dice.schemeBonus>0?"+ ":"− "}{Math.abs(dice.schemeBonus)} (scheme)</span>}
                <span style={{color:"#475569"}}> = </span>
                <span style={{color:netColor,fontWeight:900,fontSize:16}}>{net>0?`+${net}`:net}</span>
              </div>
            ):(
              <div style={{textAlign:"center",color:"#334155",fontSize:13}}>off − def + luck = ?</div>
            )}
          </div>
          {revealed&&dice.guessCorrect&&<div style={{textAlign:"center",marginTop:8,fontSize:11,color:"#34d399",fontWeight:700}}>✅ Right read! You guessed the defense. +stat boost</div>}
          {revealed&&dice.guessWrong&&<div style={{textAlign:"center",marginTop:8,fontSize:11,color:"#f87171",fontWeight:700}}>❌ Wrong read — defense fooled you. −stat penalty</div>}
        </div>
        {revealed?(
          <button onClick={onReveal} style={{background:"#E63946",color:"#fff",border:"none",borderRadius:10,padding:"13px 20px",fontWeight:700,fontSize:14,cursor:"pointer",width:"100%"}}>See Result ▶</button>
        ):(
          <div style={{textAlign:"center",color:"#475569",fontSize:13,padding:"8px 0"}}>🎲🎲🎲 Snap!</div>
        )}
      </div>
    </div>
  );
}

// ─── GAUNTLET MODE ───────────────────────────────────────────────────────────

const GAUNTLET_SAVE_KEY = "gridiron-gauntlet-leaderboard-v1";

// Objective types — each has a generator that produces a specific challenge
const OBJECTIVE_TYPES = [
  {
    id:"td_fast",
    label:"Quick Strike",
    icon:"⚡",
    generate:(level)=>({
      type:"td_fast",
      // Levels 1-3: 8 plays | 4-6: 7 plays | 7-9: 6 | 10+: 5 | 13+: 4
      desc:`Score a TD in ${Math.max(4,9-Math.floor(level/3))} plays or fewer`,
      playsAllowed: Math.max(4,9-Math.floor(level/3)),
      startField: Math.max(20, 35-Math.floor(level/2)), // start closer in early levels
      playsUsed:0, complete:false, failed:false,
    }),
  },
  {
    id:"red_zone",
    label:"Red Zone",
    icon:"🏠",
    generate:(level)=>({
      type:"red_zone",
      // Early: 4 plays from the 15 | later: 3 plays from the 10 | late: 2 plays from the 5
      desc:`Score from inside the ${level>=10?5:level>=5?10:15}-yard line in ${level>=10?2:level>=5?3:4} plays`,
      startField:level>=10?95:level>=5?90:85,
      playsAllowed:level>=10?2:level>=5?3:4,
      playsUsed:0, complete:false, failed:false,
    }),
  },
  {
    id:"third_down",
    label:"3rd Down Hero",
    icon:"🎯",
    generate:(level)=>({
      type:"third_down",
      // Level 1-4: just 1 conversion | 5-9: 2 | 10+: 3
      desc:`Convert ${level>=10?3:level>=5?2:1} consecutive 3rd down${level>=5?"s":""}`,
      needed: level>=10?3:level>=5?2:1,
      streak:0, complete:false, failed:false,
    }),
  },
  {
    id:"no_turnover",
    label:"Ball Security",
    icon:"🔒",
    generate:(level)=>({
      type:"no_turnover",
      // Level 1-3: 3 plays | 4-7: 5 | 8+: 7
      desc:`Complete a ${level>=8?7:level>=4?5:3}-play drive with zero turnovers`,
      playsNeeded: level>=8?7:level>=4?5:3,
      playsCompleted:0, complete:false, failed:false,
    }),
  },
  {
    id:"comeback",
    label:"Comeback Kid",
    icon:"🔥",
    generate:(level)=>({
      type:"comeback",
      // Early: 1 TD from own 20 | mid: 1 TD from own 10 | late: 2 TDs from own 10
      desc:`Score ${level>=8?2:1} TD${level>=8?"s":""} starting from your own ${level>=5?10:20}-yard line`,
      startField:level>=5?10:20,
      tdsNeeded:level>=8?2:1,
      tdsScored:0, complete:false, failed:false,
    }),
  },
  {
    id:"fourth_down",
    label:"4th Down Gambler",
    icon:"🎲",
    generate:(level)=>({
      type:"fourth_down",
      // Level 1-6: 1 conversion | 7-11: 2 | 12+: 3
      desc:`Convert ${level>=12?3:level>=7?2:1} consecutive 4th down${level>=7?"s":""}`,
      needed: level>=12?3:level>=7?2:1,
      streak:0, complete:false, failed:false,
    }),
  },
  {
    id:"big_play",
    label:"Big Play",
    icon:"🚀",
    generate:(level)=>({
      type:"big_play",
      // Level 1: just 10 yards | scales to 30 by level 10
      desc:`Gain ${Math.min(10+level*2,30)}+ yards on a single play`,
      yardsNeeded: Math.min(10+level*2,30),
      playsAllowed: Math.max(3, 6-Math.floor(level/4)), // limited attempts
      complete:false, failed:false,
    }),
  },
  {
    id:"drive_score",
    label:"Full Drive",
    icon:"🏈",
    generate:(level)=>({
      type:"drive_score",
      // Early: start at own 35 with generous plays | late: own 15
      desc:`Score TD starting from your own ${level>=8?15:level>=4?25:35}-yard line`,
      startField:level>=8?15:level>=4?25:35,
      complete:false, failed:false,
    }),
  },
];

// Pick a non-repeating objective for each level
function generateObjective(level, lastType=null) {
  const eligible = OBJECTIVE_TYPES.filter(o=>o.id!==lastType);
  // Early levels: only use the forgiving objectives, gate harder ones for later
  const pool = level<=2
    ? eligible.filter(o=>["td_fast","red_zone","big_play","drive_score"].includes(o.id))
    : level<=5
    ? eligible.filter(o=>o.id!=="fourth_down")
    : level<=8
    ? eligible.filter(o=>o.id!=="fourth_down"||level>=6)
    : eligible;
  const type = pool[Math.floor(Math.random()*pool.length)];
  return type.generate(level);
}

// AI defense stat boost by level — much gentler early on
function gauntletDefenseBoost(level) {
  // Level 1-3: 0 boost (learn the game)
  // Level 4-8: +5 per level above 3
  // Level 9-13: +10 per level above 8
  // Level 14+: +15 per level above 13
  if(level<=3) return 0;
  if(level<=8) return (level-3)*5;
  if(level<=13) return 25 + (level-8)*10;
  return 75 + (level-13)*15;
}

// Score calculation
function gauntletScore(level, playsUsed, playsAllowed, bonusMultiplier) {
  const base = 1000 * level;
  const sparePlays = Math.max(0,(playsAllowed||5)-playsUsed);
  const speedBonus = sparePlays * 250;
  const mult = Math.min(3.0, 1.0 + (level-1)*0.14);
  return Math.round((base + speedBonus) * mult * bonusMultiplier);
}

// Leaderboard storage
async function loadLeaderboard() {
  try {
    if(window.storage) {
      const r = await window.storage.get(GAUNTLET_SAVE_KEY, true); // shared=true
      if(r?.value) return JSON.parse(r.value);
    }
  } catch(e) {}
  try {
    const raw = localStorage.getItem(GAUNTLET_SAVE_KEY);
    if(raw) return JSON.parse(raw);
  } catch(e) {}
  return { daily:[], weekly:[], allTime:[] };
}

async function saveLeaderboard(lb) {
  const json = JSON.stringify(lb);
  try { if(window.storage) await window.storage.set(GAUNTLET_SAVE_KEY, json, true); } catch(e) {}
  try { localStorage.setItem(GAUNTLET_SAVE_KEY, json); } catch(e) {}
}

function addToLeaderboard(lb, entry) {
  // entry: { name, score, level, date }
  const now = new Date();
  const todayStr = now.toISOString().slice(0,10);
  const weekStr = `${now.getFullYear()}-W${Math.ceil(now.getDate()/7)}`;

  const insert = (arr, e) => {
    const next = [...arr, e].sort((a,b)=>b.score-a.score).slice(0,10);
    return next;
  };

  const isToday = e => e.date?.slice(0,10)===todayStr;
  const isThisWeek = e => {
    const d = new Date(e.date);
    const w = `${d.getFullYear()}-W${Math.ceil(d.getDate()/7)}`;
    return w===weekStr;
  };

  return {
    daily:   insert(lb.daily.filter(isToday), {...entry, date:now.toISOString()}),
    weekly:  insert(lb.weekly.filter(isThisWeek), {...entry, date:now.toISOString()}),
    allTime: insert(lb.allTime, {...entry, date:now.toISOString()}),
  };
}

// Build gauntlet AI roster scaled to level
function buildGauntletAIRoster(level) {
  const boost = gauntletDefenseBoost(level);
  const pool = buildDraftPool();
  const overall = p => (p.pass_rush+p.coverage+p.tackle+p.instinct)/4;
  // Pick best defense players scaled to level
  const defPlayers = pool
    .filter(p=>p.side==="defense")
    .sort((a,b)=>overall(b)-overall(a))
    .slice(0, Math.min(7, 4 + Math.floor(level/2)));
  // Apply stat boost
  const boosted = defPlayers.map(p=>({
    ...p,
    pass_rush: Math.min(99,p.pass_rush+boost),
    coverage:  Math.min(99,p.coverage+boost),
    tackle:    Math.min(99,p.tackle+boost),
    instinct:  Math.min(99,p.instinct+boost),
  }));
  // Fill offense with average players (AI is just the defense here)
  const offPlayers = pool.filter(p=>p.side==="offense").slice(0,8);
  return { starters:[...offPlayers,...boosted], bench:[] };
}

// ─── GAUNTLET COMPONENTS ─────────────────────────────────────────────────────

function ObjectiveCard({obj, playsUsed, compact=false}) {
  if(!obj) return null;
  const done = obj.complete;
  const failed = obj.failed;
  const color = done?"#34d399":failed?"#f87171":"#f59e0b";
  const icon = done?"✅":failed?"❌":obj.icon||"🎯";

  // Progress calculation per type
  let progress = null;
  if(obj.type==="td_fast"||obj.type==="red_zone"||obj.type==="drive_score")
    progress = obj.playsUsed!=null ? `${obj.playsAllowed!=null?`${obj.playsUsed}/${obj.playsAllowed} plays`:""}` : null;
  if(obj.type==="third_down") progress = `${obj.streak||0}/${obj.needed} converted`;
  if(obj.type==="fourth_down") progress = `${obj.streak||0}/${obj.needed} converted`;
  if(obj.type==="no_turnover") progress = `${obj.playsCompleted||0}/${obj.playsNeeded} plays`;
  if(obj.type==="comeback") progress = `${obj.tdsScored||0}/${obj.tdsNeeded} TDs`;
  if(obj.type==="big_play") progress = `Need ${obj.yardsNeeded}+ yards`;

  return (
    <div style={{background:done?"#052e16":failed?"#1c0505":"#0f172a",border:`2px solid ${color}`,borderRadius:10,padding:compact?"8px 12px":"12px 14px"}}>
      <div style={{display:"flex",alignItems:"center",gap:8}}>
        <span style={{fontSize:compact?18:22}}>{icon}</span>
        <div style={{flex:1}}>
          <div style={{fontSize:compact?11:13,fontWeight:700,color}}>{obj.label||obj.type}</div>
          <div style={{fontSize:compact?10:12,color:"#94a3b8",marginTop:1}}>{obj.desc}</div>
          {progress&&<div style={{fontSize:10,color:color,marginTop:3,fontWeight:700}}>{progress}</div>}
        </div>
      </div>
    </div>
  );
}

function RosterPanel({roster, color, onClose}) {
  const starters = roster?.starters || [];
  const offense = starters.filter(p=>p.side==="offense");
  const STAT_MAP = {
    QB:[["ARM","primary","#60a5fa"],["ACC","secondary","#E63946"],["MOB","speed","#E9C46A"],["IQ","awareness","#2A9D8F"]],
    RB:[["PWR","primary","#60a5fa"],["ELU","secondary","#E63946"],["SPD","speed","#E9C46A"],["VIS","awareness","#2A9D8F"]],
    WR:[["RTE","primary","#60a5fa"],["HND","secondary","#E63946"],["SPD","speed","#E9C46A"],["IQ","awareness","#2A9D8F"]],
    TE:[["BLK","primary","#60a5fa"],["HND","secondary","#E63946"],["SPD","speed","#E9C46A"],["IQ","awareness","#2A9D8F"]],
    OL:[["RUN","primary","#60a5fa"],["PAS","secondary","#E63946"],["QCK","speed","#E9C46A"],["IQ","awareness","#2A9D8F"]],
  };
  return (
    <div style={{background:"#0f172a",border:`1px solid ${color}44`,borderRadius:10,padding:"10px 12px",marginBottom:10}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
        <div style={{fontSize:11,fontWeight:700,color,textTransform:"uppercase",letterSpacing:1}}>Your Offense</div>
        {onClose&&<button onClick={onClose} style={{background:"none",border:"none",color:"#475569",fontSize:16,cursor:"pointer",padding:"0 4px"}}>✕</button>}
      </div>
      <div style={{display:"flex",flexDirection:"column",gap:6}}>
        {offense.map(p=>{
          const stats = STAT_MAP[p.pos] || STAT_MAP.WR;
          return (
            <div key={p.id} style={{background:"#111827",borderRadius:8,padding:"7px 10px"}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                <div>
                  <span style={{fontWeight:700,fontSize:12,color:"#f8fafc"}}>{p.name}</span>
                  <span style={{fontSize:10,color:"#64748b",marginLeft:6}}>{p.pos}</span>
                </div>
                <TierBadge tier={p.tier}/>
              </div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"2px 8px"}}>
                {stats.map(([l,k,c])=>(
                  <div key={l}>
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:1}}>
                      <span style={{fontSize:8,color:"#64748b"}}>{l}</span>
                      <span style={{fontSize:8,color:"#94a3b8",fontWeight:700}}>{p[k]}</span>
                    </div>
                    <StatBar value={p[k]} color={c}/>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


function GauntletScoreboard({level, score, obj, teamName, teamColor}) {
  return (
    <div style={{width:"100%",maxWidth:580,padding:"8px 10px 0",boxSizing:"border-box"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          <div style={{background:"linear-gradient(135deg,#f59e0b,#d97706)",borderRadius:8,padding:"4px 10px"}}>
            <span style={{fontSize:11,fontWeight:900,color:"#1a0a00"}}>LEVEL {level}</span>
          </div>
          <TeamLogo teamName={teamName} primary={teamColor} secondary="#fff" size={28}/>
          <span style={{fontSize:13,fontWeight:700,color:teamColor}}>{teamName}</span>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{fontSize:10,color:"#64748b",textTransform:"uppercase",letterSpacing:1}}>Score</div>
          <div style={{fontSize:18,fontWeight:900,color:"#f59e0b"}}>{score.toLocaleString()}</div>
        </div>
      </div>
      {obj&&<ObjectiveCard obj={obj} compact/>}
    </div>
  );
}


function GridironGame() {
  const [g, setG] = useState(initGame());
  const [teamName, setTeamName] = useState(TEAM_NAMES[0]);
  const [aiTeamName, setAiTeamName] = useState(TEAM_NAMES[1]);
  const [playerColorIdx, setPlayerColorIdx] = useState(0);
  const [aiColorIdx, setAiColorIdx] = useState(1);
  const [soundOn, setSoundOn] = useState(true);
  const [minutesPerQuarter, setMinutesPerQuarter] = useState(5);
  const [skipDraft, setSkipDraft] = useState(false);
  const [onlineState, setOnlineState] = useState("idle");
  const [roomCode, setRoomCode] = useState("");
  const [roomInput, setRoomInput] = useState("");
  const [onlineSide, setOnlineSide] = useState(null);
  const [onlineError, setOnlineError] = useState("");
  const [shotClock, setShotClock] = useState(null);
  const consecutiveMissedRef = useRef(0);
  const logRef = useRef(null);
  // ── GAUNTLET STATE ────────────────────────────────────────────────────────────
  const [gauntlet, setGauntlet] = useState(null); // null = not in gauntlet mode
  const [leaderboard, setLeaderboard] = useState({daily:[],weekly:[],allTime:[]});
  const [gauntletPhase, setGauntletPhase] = useState("idle"); // idle|draft|playing|upgrade|gameover|leaderboard
  const [gauntletName, setGauntletName] = useState("");
  const [lbTab, setLbTab] = useState("allTime");
  const [showGauntletRoster, setShowGauntletRoster] = useState(false);
  const [showTeamDrop, setShowTeamDrop] = useState(false);
  const [showAiTeamDrop, setShowAiTeamDrop] = useState(false);

  useEffect(()=>{ if(logRef.current) logRef.current.scrollTop=logRef.current.scrollHeight; },[g.gameLog]);

  // ── SHOT CLOCK (online offense AND defense) ───────────────────────────────
  useEffect(()=>{
    if(g.mode!=="online") return;
    const isOffenseClock = g.phase==="play_call_offense" && g._turn===onlineSide;
    const isDefenseClock = g.phase==="play_call_defense" && g._turn===onlineSide;
    if(!isOffenseClock && !isDefenseClock) { setShotClock(null); return; }

    setShotClock(10);
    const iv = setInterval(()=>{
      setShotClock(prev=>{
        if(prev===null) return null;
        if(prev<=1) {
          clearInterval(iv);

          if(isOffenseClock) {
            // Auto-select a random offensive play
            const autoPlay = OFFENSE_PLAYS[Math.floor(Math.random()*OFFENSE_PLAYS.length)].id;
            consecutiveMissedRef.current += 1;
            const missed = consecutiveMissedRef.current;
            setG(s=>{
              if(s.phase!=="play_call_offense") return s;
              if(missed>=2) {
                consecutiveMissedRef.current=0;
                const pen={...s,
                  fieldPosition:Math.max(1,s.fieldPosition-5),
                  down:s.down+1,
                  yardsToGo:s.yardsToGo+5,
                  gameLog:[...s.gameLog,`🚨 Delay of Game! -5 yards, loss of down (${s.teams[s.possession]})`]
                };
                if(pen.down>4){
                  const newPos=100-Math.max(1,pen.fieldPosition);
                  const newPoss=pen.possession==="away"?"home":"away";
                  const turned={...pen,possession:newPoss,fieldPosition:newPos,down:1,yardsToGo:10,driveLog:[],_turn:newPoss,
                    gameLog:[...pen.gameLog,`📋 Turnover on downs — ${pen.teams[newPoss]} take over`]};
                  pushOnlineState(turned);
                  return turned;
                }
                pushOnlineState(pen);
                return pen;
              }
              const defSide=s.possession==="away"?"home":"away";
              const ns={...s,offensePlay:autoPlay,phase:"play_call_defense",_turn:defSide,
                gameLog:[...s.gameLog,`⏱️ Play clock expired — ${s.teams[s.possession]} auto-called ${OFFENSE_PLAYS.find(p=>p.id===autoPlay)?.label}`]};
              pushOnlineState(ns);
              return ns;
            });
          } else {
            // Defense clock expired — auto-pick a defensive scheme
            const autoDefense = DEFENSE_PLAYS[Math.floor(Math.random()*DEFENSE_PLAYS.length)].id;
            setG(s=>{
              if(s.phase!=="play_call_defense") return s;
              const dice = resolvePlay(
                s.offensePlay, autoDefense,
                s.possession===s.playerSide ? s.playerRoster : s.aiRoster,
                s.possession===s.playerSide ? s.aiRoster : s.playerRoster,
                s.playGuess, {yardsToTD: yardsToTD(s.fieldPosition)}
              );
              const ns={...s,defensePlay:autoDefense,lastDice:dice,phase:"rolling",_turn:s.possession,
                gameLog:[...s.gameLog,`⏱️ Play clock expired — ${s.teams[s.possession==="away"?"home":"away"]} auto-called ${DEFENSE_PLAYS.find(p=>p.id===autoDefense)?.label}`]};
              pushOnlineState(ns);
              return ns;
            });
          }
          return 0;
        }
        return prev-1;
      });
    },1000);
    return()=>clearInterval(iv);
  },[g.phase,g._turn,g.mode,onlineSide]);


  // ── AI AUTO-ACTIONS (vs-ai only — never fires in online mode) ──────────────
  useEffect(()=>{
    if(g.mode!=="vs-ai"&&g.mode!=="gauntlet") return;
    const playerHasBall = g.possession===g.playerSide;

    if(g.phase==="play_call_offense" && !playerHasBall) {
      const play = aiPickOffensePlay(g.down, g.yardsToGo, yardsToTD(g.fieldPosition), g.score, g.possession, g.quarter, g.gameLog);
      const t = setTimeout(()=>setG(prev=>({...prev,offensePlay:play,phase:"play_call_defense",_turn:prev.possession==="away"?"home":"away"})),600);
      return()=>clearTimeout(t);
    }
    if(g.phase==="play_call_defense" && playerHasBall) {
      const play = aiPickDefensePlay(g.offensePlay, g.down, g.yardsToGo, g.score, g.possession==="away"?"home":"away", g.quarter);
      const t = setTimeout(()=>setG(prev=>{
        const dice = resolvePlay(
          prev.offensePlay, play,
          prev.possession===prev.playerSide ? prev.playerRoster : prev.aiRoster,
          prev.possession===prev.playerSide ? prev.aiRoster : prev.playerRoster,
          prev.playGuess, {yardsToTD: yardsToTD(prev.fieldPosition)}
        );
        return {...prev, defensePlay:play, lastDice:dice, phase:"rolling", _turn:prev.possession};
      }),600);
      return()=>clearTimeout(t);
    }
    if(g.phase==="special_teams_call" && !playerHasBall) {
      const t = setTimeout(()=>handleSpecialTeams("punt"),600);
      return()=>clearTimeout(t);
    }
  },[g.phase,g.possession,g.mode]);

  // Auto-advance result after 5s in vs-ai only
  useEffect(()=>{
    if(g.phase!=="result"||(g.mode!=="vs-ai"&&g.mode!=="gauntlet")) return;
    const t=setTimeout(()=>setG(prev=>prev.phase==="result"?nextPlayState(prev):prev),5000);
    return()=>clearTimeout(t);
  },[g.phase,g.mode]);

  // ── ONLINE MULTIPLAYER SYNC ──────────────────────────────────────────────────
  // Flow:
  //   Both players draft independently (solo draft, _playoffDraft=true)
  //   After coin toss, possession determines who acts first
  //   Offense (_turn === possession) calls play → pushes → defense sees it
  //   Defense (_turn === defSide) calls scheme → resolves dice → pushes result
  //   Whoever resolved pushes the result state → both see rolling → offense sees result
  //   Offense acknowledges result (_turn === possession) → pushes next play_call_offense
  //   Repeat

  // In online mode, "my turn" = g._turn === onlineSide
  const isMyOnlineTurn = g.mode==="online" && g._turn===onlineSide;

  // Poll for opponent's state
  useEffect(()=>{
    if(onlineState!=="playing"||!roomCode) return;
    const poll=setInterval(async()=>{
      try {
        const remote=await supa.getRoom(roomCode);
        if(!remote||!remote._writer) return;
        if(remote._writer===onlineSide) return; // our own push, ignore
        // Apply opponent's state, preserving our local-only fields
        setG(prev=>({
          ...remote,
          playerSide: prev.playerSide,
          playerRoster: prev.playerRoster,
          aiRoster: prev.aiRoster,
          mode: "online",
          playGuess: remote._turn===onlineSide ? prev.playGuess : null, // keep guess only on our turn
        }));
      } catch(e) {}
    },1500);
    return()=>clearInterval(poll);
  },[onlineState,roomCode,onlineSide]);

  // Helper: push current state to Supabase immediately after an action in online mode
  function pushOnlineState(newState) {
    if(!roomCode||onlineState!=="playing") return;
    supa.upsertRoom(roomCode,{...newState,_writer:onlineSide}).catch(()=>{});
  }

  // AI draft
  useEffect(()=>{
    if(g.phase!=="draft"||g._playoffDraft) return;
    if(g.draftPick>=16) return;
    if(draftPickOwner(g.draftPick)!==1) return;
    const t=setTimeout(()=>{
      setG(prev=>{
        if(prev.phase!=="draft"||prev._playoffDraft||draftPickOwner(prev.draftPick)!==1) return prev;
        const overall=p=>p.side==="offense"?(p.primary+p.secondary+p.speed+p.awareness)/4:(p.pass_rush+p.coverage+p.tackle+p.instinct)/4;
        const taken=[...prev.playerRoster.starters,...prev.aiRoster.starters].map(p=>p.id);
        const aiTC=rosterTierCount(prev.aiRoster.starters);
        const offCount=prev.aiRoster.starters.filter(p=>p.side==="offense").length;
        const defCount=prev.aiRoster.starters.filter(p=>p.side==="defense").length;
        const cands=prev.draftPool.filter(p=>{
          if(taken.includes(p.id)) return false;
          if(p.side==="offense"&&offCount>=4) return false;
          if(p.side==="defense"&&defCount>=4) return false;
          const limit=DRAFT_TIER_LIMITS[p.tier]??0;
          if(limit===0) return false;
          if((aiTC[p.tier]||0)>=limit) return false;
          return true;
        }).sort((a,b)=>overall(b)-overall(a));
        const pick=cands[0];
        if(!pick) return {...prev,draftPick:prev.draftPick+1};
        const newAI={starters:[...prev.aiRoster.starters,pick],bench:[]};
        const next=prev.draftPick+1;
        if(next>=16) {
          const allTaken=[...prev.playerRoster.starters,...newAI.starters].map(p=>p.id);
          const filledPlayer={starters:autoFillRoster(prev.playerRoster.starters,prev.draftPool,allTaken,FULL_OFFENSE,FULL_DEFENSE),bench:[]};
          const taken2=[...filledPlayer.starters,...newAI.starters].map(p=>p.id);
          const filledAI={starters:autoFillRoster(newAI.starters,prev.draftPool,taken2,FULL_OFFENSE,FULL_DEFENSE),bench:[]};
          return{...prev,aiRoster:filledAI,playerRoster:filledPlayer,draftPick:next,draftOptions:[],phase:"coin_toss",gameLog:[`🏈 ${prev.teams.away} vs ${prev.teams.home}`,`--- Q1 ---`]};
        }
        if(draftPickOwner(next)===1) {
          return{...prev,aiRoster:newAI,draftPick:next};
        }
        const newTaken=[...prev.playerRoster.starters,...newAI.starters].map(p=>p.id);
        const pTC=rosterTierCount(prev.playerRoster.starters);
        const pOff=prev.playerRoster.starters.filter(p=>p.side==="offense").length;
        const pDef=prev.playerRoster.starters.filter(p=>p.side==="defense").length;
        const opts=buildDraftOptions(prev.draftPool,newTaken,pOff<4,pDef<4,pTC,3);
        return{...prev,aiRoster:newAI,draftPick:next,draftOptions:opts};
      });
    },150);
    return()=>clearTimeout(t);
  },[g.phase,g.draftPick]);

  // ── STATE TRANSITIONS ──────────────────────────────────────────────────────
  function nextPlayState(prev) {
    // Called after a play result is acknowledged — offense (possession) acts next
    return {...prev, phase:"play_call_offense", offensePlay:null, defensePlay:null, playGuess:null, lastResult:null, _turn:prev.possession};
  }

  function kickoff(side) {
    // side = who kicks off; receiving team starts at own 25
    const receiving = side==="away"?"home":"away";
    return{possession:receiving, fieldPosition:25, down:1, yardsToGo:10, driveLog:[], phase:"play_call_offense", _turn:receiving};
  }

  function changePossession(prev, newFieldPos=20) {
    const newPoss=prev.possession==="away"?"home":"away";
    return{...prev, possession:newPoss, fieldPosition:newFieldPos, down:1, yardsToGo:10, driveLog:[],
      gameLog:[...prev.gameLog,`🔄 ${prev.teams[newPoss]} take over on offense`]};
  }

  function handleSpecialTeams(choice) {
    // choice: "punt"|"fg"|"go"
    setG(prev=>{
      const side=prev.possession;
      const yardsLeft=yardsToTD(prev.fieldPosition);
      if(choice==="fg") {
        // FG range: if within 50 yards of goal (fieldPosition >= 50 for "easy", 40+ risky)
        const range=yardsLeft+17; // snap+kick distance
        const success=range<=50?(Math.random()<0.9):(range<=60?(Math.random()<0.7):(Math.random()<0.4));
        if(success) {
          playSound("fg");
          const newScore={...prev.score}; newScore[side]+=3;
          const log=`⚡ ${prev.teams[side]} FG is GOOD! ${newScore.away}–${newScore.home}`;
          const next=advanceClock(prev,25);
          const turned=changePossession({...prev,...next,score:newScore,gameLog:[...prev.gameLog,log]},20);
          return checkQuarterOrGameEnd(turned);
        } else {
          playSound("loss");
          const log=`❌ ${prev.teams[side]} FG missed!`;
          const next=advanceClock(prev,5);
          const turned=changePossession({...prev,...next,gameLog:[...prev.gameLog,log]},yardsLeft<17?80:prev.fieldPosition);
          return checkQuarterOrGameEnd(turned);
        }
      }
      if(choice==="punt") {
        playSound("punt");
        // Punt ~40 yards net
        const puntYards=35+Math.floor(Math.random()*15);
        const newPos=Math.max(20, Math.min(80, 100-prev.fieldPosition-puntYards+100));
        const simpleNewPos=Math.max(10,Math.min(40,100-prev.fieldPosition-puntYards));
        // New possession starts at how many yards from THEIR own goal
        const log=`👢 ${prev.teams[side]} punts — ${prev.teams[side==="away"?"home":"away"]} starts at own ${simpleNewPos}`;
        const next=advanceClock(prev,20);
        const turned=changePossession({...prev,...next,gameLog:[...prev.gameLog,log]},simpleNewPos);
        return checkQuarterOrGameEnd(turned);
      }
      if(choice==="go") {
        return{...prev,phase:"play_call_offense"};
      }
      return prev;
    });
  }

  function advanceClock(prev, seconds) {
    let newClock=prev.gameClock-seconds;
    let newQuarter=prev.quarter;
    if(newClock<=0&&newQuarter<4) {
      newClock=prev._clockPerQuarter||300; newQuarter++;
    }
    return{gameClock:Math.max(0,newClock),quarter:newQuarter};
  }

  function checkQuarterOrGameEnd(state) {
    const totalQuarters=4;
    // Game over when Q4 (or OT) clock hits 0
    if(state.gameClock<=0 && state.quarter>=totalQuarters) {
      if(state.quarter===totalQuarters) {
        // End of Q4
        if(state.score.away===state.score.home) {
          return{...state,quarter:totalQuarters+1,gameClock:300,phase:"play_call_offense",
            gameLog:[...state.gameLog,"⚡ OVERTIME! Sudden death!"]};
        }
        return{...state,phase:"gameover"};
      }
      // OT ended
      return{...state,phase:"gameover"};
    }
    if(state.gameClock===0&&state.quarter<totalQuarters) {
      if(state.quarter===2) {
        return{...state,phase:"halftime",
          gameLog:[...state.gameLog,`--- HALFTIME ---`]};
      }
      return{...state,gameLog:[...state.gameLog,`--- Q${state.quarter} ---`]};
    }
    return state;
  }

  function resolvePlayResult() {
    setG(prev=>{
      const dice=prev.lastDice;
      if(!dice) return prev;
      const{yards,special}=dice;
      const offSide=prev.possession;
      const defSide=offSide==="away"?"home":"away";
      let newScore={...prev.score};
      let newFieldPos=prev.fieldPosition+yards;
      let newDown=prev.down;
      let newYTG=prev.yardsToGo-yards;
      let newLog=[...prev.gameLog];
      const playName=OFFENSE_PLAYS.find(p=>p.id===prev.offensePlay)?.label||"Play";
      const defName=DEFENSE_PLAYS.find(p=>p.id===prev.defensePlay)?.label||"?";
      newLog.push(`${playName} vs ${defName}: ${dice.yardLabel}`);

      let clockUsed=25+Math.floor(Math.random()*15);
      let nextPhase="play_call_offense";
      let newPoss=offSide;
      let newDriveLog=[...prev.driveLog,{offensePlay:prev.offensePlay,defensePlay:prev.defensePlay,yards,special}];

      // Handle special events
      if(special==="touchdown") {
        playSound("touchdown");
        newScore[offSide]+=7; // auto PAT
        newLog.push(`🏈 TOUCHDOWN ${prev.teams[offSide]}! +7 (PAT) → ${newScore.away}–${newScore.home}`);
        const clockState=advanceClock(prev,clockUsed);
        // Gauntlet: player always keeps possession — reset to own 25
        if(prev.mode==="gauntlet") {
          return checkQuarterOrGameEnd({...prev,...clockState,score:newScore,gameLog:newLog,driveLog:[],
            possession:offSide,fieldPosition:25,down:1,yardsToGo:10,
            lastResult:dice.yardLabel,phase:"result",lastDice:{...dice,specialMsg:`TOUCHDOWN! ${prev.teams[offSide]} score 7!`}});
        }
        const kicked=kickoff(offSide);
        return checkQuarterOrGameEnd({...prev,...clockState,...kicked,score:newScore,gameLog:newLog,driveLog:[],lastResult:dice.yardLabel,phase:"result",lastDice:{...dice,specialMsg:`TOUCHDOWN! ${prev.teams[offSide]} score 7!`}});
      }
      if(special==="fumble"||special==="interception") {
        playSound("turnover");
        const turnoverSpot = Math.max(1, Math.min(99, prev.fieldPosition + yards));
        const newTeamFieldPos = 100 - turnoverSpot;
        newLog.push(`🔄 TURNOVER! ${prev.teams[defSide]} take over at their own ${newTeamFieldPos}.`);
        const clockState=advanceClock(prev,clockUsed);
        // Gauntlet: turnovers reset player to own 25 instead of flipping possession
        if(prev.mode==="gauntlet") {
          return checkQuarterOrGameEnd({...prev,...clockState,score:newScore,gameLog:newLog,driveLog:[],
            possession:offSide,fieldPosition:25,down:1,yardsToGo:10,
            lastResult:dice.yardLabel,phase:"result",score:newScore});
        }
        const turned=changePossession({...prev,...clockState,fieldPosition:turnoverSpot,gameLog:newLog,driveLog:[]},newTeamFieldPos);
        return checkQuarterOrGameEnd({...turned,lastResult:dice.yardLabel,phase:"result",score:newScore});
      }
      if(special==="sack") {
        playSound("sack");
        newFieldPos=prev.fieldPosition+yards; // negative yards
        newDown++; newYTG=prev.yardsToGo-yards;
        const clockState=advanceClock(prev,clockUsed);
        if(newDown>4){
          if(prev.mode==="gauntlet") {
            newLog.push(`📋 Turnover on downs — resetting drive.`);
            return checkQuarterOrGameEnd({...prev,...clockState,fieldPosition:25,down:1,yardsToGo:10,score:newScore,gameLog:newLog,driveLog:[],lastResult:dice.yardLabel,phase:"result"});
          }
          const turned=changePossession({...prev,...clockState,fieldPosition:Math.max(1,newFieldPos),score:newScore,gameLog:newLog,driveLog:[]});
          return checkQuarterOrGameEnd({...turned,lastResult:dice.yardLabel,phase:"result"});
        }
        return checkQuarterOrGameEnd({...prev,...clockState,fieldPosition:Math.max(1,newFieldPos),down:newDown,yardsToGo:newYTG,score:newScore,gameLog:newLog,driveLog:newDriveLog,lastResult:dice.yardLabel,phase:"result"});
      }

      // Normal play
      newFieldPos=Math.min(99,Math.max(1,prev.fieldPosition+yards));
      if(yards>0&&yards>=5) playSound("big_gain");
      else if(yards>0) playSound("big_gain");
      else if(yards<0) playSound("loss");

      if(newYTG<=0&&yards>0) {
        // First down!
        playSound("first_down");
        const distLeft = yardsToTD(newFieldPos);
        const isGoalToGo = distLeft <= 10;
        newLog.push(isGoalToGo ? `🟡 FIRST & GOAL!` : `🟡 FIRST DOWN!`);
        newDown=1; newYTG=isGoalToGo ? distLeft : 10;
      } else {
        newDown++;
      }

      const clockState=advanceClock(prev,clockUsed);

      // 4th down check
      if(newDown>4) {
        // Gauntlet: no possession change — just reset to own 25
        if(prev.mode==="gauntlet") {
          newLog.push(`📋 Turnover on downs — resetting drive.`);
          return checkQuarterOrGameEnd({...prev,...clockState,fieldPosition:25,down:1,yardsToGo:10,score:newScore,gameLog:newLog,driveLog:[],lastResult:dice.yardLabel,phase:"result"});
        }
        // Turn it over on downs — ball stays at the spot, flip for new offense
        const downsSpot = Math.max(1, Math.min(99, newFieldPos));
        const newTeamPos = 100 - downsSpot;
        newLog.push(`📋 Turnover on downs — ${prev.teams[defSide]} take over at their own ${newTeamPos}.`);
        const turned=changePossession({...prev,...clockState,fieldPosition:downsSpot,score:newScore,gameLog:newLog,driveLog:[]},newTeamPos);
        return checkQuarterOrGameEnd({...turned,lastResult:dice.yardLabel,phase:"result"});
      }

      // Special teams decision — only if the human has the ball
      const humanHasBall = prev.possession === prev.playerSide;
      const inFGRangeNow = yardsToTD(newFieldPos) <= 45;

      if(newDown>4) {
        if(humanHasBall) {
          return checkQuarterOrGameEnd({...prev,...clockState,fieldPosition:newFieldPos,down:newDown,yardsToGo:newYTG,score:newScore,gameLog:newLog,driveLog:newDriveLog,lastResult:dice.yardLabel,phase:"result",_pendingSpecialTeams:true});
        } else {
          const distToTD = yardsToTD(newFieldPos);
          const inFGRange = distToTD <= 45;
          const fgRange = distToTD + 17;
          const deficit = newScore[defSide] - newScore[offSide];
          const inOwnTerritory = newFieldPos <= 50;
          // Only go for it on 4th & short AND in opponent territory AND down late
          const shouldGoForIt = !inOwnTerritory && newYTG <= 3 && deficit >= 8 && prev.quarter >= 4;
          if(shouldGoForIt) {
            // AI goes for it — just continue the drive on the next play call
            newLog.push(`💪 ${prev.teams[offSide]} goes for it on 4th & ${newYTG}!`);
            return checkQuarterOrGameEnd({...prev,...clockState,fieldPosition:newFieldPos,down:4,yardsToGo:Math.max(1,newYTG),score:newScore,gameLog:newLog,driveLog:newDriveLog,lastResult:dice.yardLabel,phase:"result"});
          } else if(inFGRange) {
            const success = fgRange<=50?(Math.random()<0.9):(fgRange<=60?(Math.random()<0.7):(Math.random()<0.4));
            if(success) {
              playSound("fg");
              newScore[offSide]+=3;
              newLog.push(`⚡ ${prev.teams[offSide]} FG is GOOD! ${newScore.away}–${newScore.home}`);
              const turned=changePossession({...prev,...clockState,fieldPosition:newFieldPos,score:newScore,gameLog:newLog,driveLog:[]},20);
              return checkQuarterOrGameEnd({...turned,lastResult:dice.yardLabel,phase:"result"});
            } else {
              newLog.push(`❌ ${prev.teams[offSide]} FG missed!`);
              const turned=changePossession({...prev,...clockState,fieldPosition:newFieldPos,score:newScore,gameLog:newLog,driveLog:[]},distToTD<17?80:100-newFieldPos);
              return checkQuarterOrGameEnd({...turned,lastResult:dice.yardLabel,phase:"result"});
            }
          } else {
            // Punt — always the safe call from own territory or when not in FG range
            const puntYards=35+Math.floor(Math.random()*15);
            const simpleNewPos=Math.max(10,Math.min(40,100-newFieldPos-puntYards));
            newLog.push(`👢 ${prev.teams[offSide]} punts — ${prev.teams[defSide]} starts at own ${simpleNewPos}.`);
            const turned=changePossession({...prev,...clockState,fieldPosition:newFieldPos,score:newScore,gameLog:newLog,driveLog:[]},simpleNewPos);
            return checkQuarterOrGameEnd({...turned,lastResult:dice.yardLabel,phase:"result"});
          }
        }
      }

      return checkQuarterOrGameEnd({...prev,...clockState,fieldPosition:newFieldPos,down:newDown,yardsToGo:Math.max(1,newYTG),score:newScore,gameLog:newLog,driveLog:newDriveLog,lastResult:dice.yardLabel,phase:"result"});
    });
    // Push result state to opponent after resolving
    if(g.mode==="online") {
      setTimeout(()=>setG(latest=>{
        pushOnlineState({...latest,_writer:onlineSide});
        return latest;
      }),50);
    }
    // Gauntlet: update objective after play resolves
    if(g.mode==="gauntlet"&&gauntlet) {
      setTimeout(()=>{
        setG(latest=>{
          const dice=latest.lastDice;
          if(!dice) return latest;
          const obj = updateGauntletObjective(
            dice.yardLabel, dice.yards, dice.special,
            latest.down, latest.yardsToGo
          );
          if(obj?.complete||obj?.failed) {
            setTimeout(()=>finishGauntletLevel(obj),1200);
          }
          return latest;
        });
      },100);
    }
  }

  function choosePitch(playId) {
    consecutiveMissedRef.current=0;
    setShotClock(null);
    // Field goal and punt resolve immediately — no defense call needed
    if(playId==="field_goal"||playId==="punt") {
      handleSpecialTeams(playId==="field_goal"?"fg":"punt");
      return;
    }
    setG(prev=>{
      const defSide = prev.possession==="away" ? "home" : "away";
      const newState = {...prev, offensePlay:playId, phase:"play_call_defense", _turn:defSide};
      if(prev.mode==="online") pushOnlineState(newState);
      return newState;
    });
  }

  function chooseDefensePlay(playId) {
    setShotClock(null); // reset clock on manual call
    setG(prev=>{
      const dice = resolvePlay(
        prev.offensePlay, playId,
        prev.possession===prev.playerSide ? prev.playerRoster : prev.aiRoster,
        prev.possession===prev.playerSide ? prev.aiRoster : prev.playerRoster,
        prev.playGuess, {yardsToTD: yardsToTD(prev.fieldPosition)}
      );
      const newState = {...prev, defensePlay:playId, lastDice:dice, phase:"rolling", _turn:prev.possession};
      if(prev.mode==="online") pushOnlineState(newState);
      return newState;
    });
  }

  function startGame(mode) { setG(prev=>({...prev,mode,phase:"setup"})); }

  function beginDraft(away,home,playerSide,aC,hC,minsPerQ) {
    const pool=buildDraftPool();
    const firstOptions=buildDraftOptions(pool,[],true,true,{S:0,A:0,B:0,C:0},3);
    setG(prev=>({...prev,teams:{away,home},playerSide,teamColors:{away:aC,home:hC},
      _clockPerQuarter:minsPerQ*60,gameClock:minsPerQ*60,
      phase:"draft",draftPool:pool,draftPick:0,draftOptions:firstOptions,
      playerRoster:{starters:[],bench:[]},aiRoster:{starters:[],bench:[]}}));
  }

  function beginRandomGame(away,home,playerSide,aC,hC,minsPerQ) {
    const pool=buildDraftPool();
    const playerRoster=buildAIRoster(pool,[]);
    const takenIds=playerRoster.starters.map(p=>p.id);
    const aiRoster=buildAIRoster(pool,takenIds);
    setG(prev=>({
      ...prev,
      teams:{away,home}, playerSide, teamColors:{away:aC,home:hC},
      _clockPerQuarter:minsPerQ*60, gameClock:minsPerQ*60,
      phase:"coin_toss",
      draftPool:pool,
      playerRoster, aiRoster,
      gameLog:[`🏈 ${away} vs ${home} (Random Teams)`],
    }));
  }

  // ── GAUNTLET FUNCTIONS ────────────────────────────────────────────────────────

  function startGauntlet(playerRoster) {
    const level = 1;
    const obj = generateObjective(level, null);
    const aiRoster = buildGauntletAIRoster(level);
    const colorIdx = playerColorIdx;
    const color = TEAM_PALETTE[colorIdx].primary;
    const gState = {
      level, score:0, totalScore:0, obj, lastObjType:obj.type,
      playerRoster, colorIdx, teamName,
      upgradesUsed:0, playsThisObj:0,
    };
    setGauntlet(gState);
    launchGauntletLevel(gState, playerRoster, aiRoster, obj);
  }

  function launchGauntletLevel(gState, playerRoster, aiRoster, obj) {
    // Set field position based on objective type
    const fp = obj.startField ?? 30;
    const newG = {
      ...initGame(),
      mode:"gauntlet", phase:"play_call_offense",
      playerSide:"away", possession:"away",
      teams:{away:gState.teamName||teamName, home:`Level ${gState.level} Defense`},
      teamColors:{away:TEAM_PALETTE[gState.colorIdx||0], home:TEAM_PALETTE[6]},
      playerRoster, aiRoster,
      fieldPosition:fp, down:1, yardsToGo:10,
      score:{away:0,home:0},
      quarter:1, gameClock:900,
      gameLog:[`🏆 Level ${gState.level}: ${obj.desc}`],
      _turn:"away",
    };
    // For 3rd/4th down challenges, start on the right down
    if(obj.type==="third_down") {
      newG.down = 3; newG.yardsToGo = 5 + Math.floor(Math.random()*6);
    }
    if(obj.type==="fourth_down") {
      newG.down = 4; newG.yardsToGo = 1 + Math.floor(Math.random()*4);
    }
    setG(newG);
    setGauntletPhase("playing");
  }

  // Called after every play result in gauntlet mode — update objective progress
  function updateGauntletObjective(playResult, yards, special, down, yardsToGo) {
    if(!gauntlet) return null;
    let obj = {...gauntlet.obj};
    const playsUsed = (gauntlet.playsThisObj||0) + 1;

    // Update plays counter
    setGauntlet(prev=>({...prev, playsThisObj:playsUsed}));

    const isTD = special==="touchdown";
    const isTurnover = special==="fumble"||special==="interception";

    switch(obj.type) {
      case "td_fast":
        obj.playsUsed = playsUsed;
        if(isTD) obj.complete = true;
        else if(playsUsed>=obj.playsAllowed) obj.failed = true;
        break;
      case "red_zone":
        obj.playsUsed = playsUsed;
        if(isTD) obj.complete = true;
        else if(playsUsed>=obj.playsAllowed||isTurnover) obj.failed = true;
        break;
      case "drive_score":
      case "comeback":
        if(isTD) {
          const tdsScored = (obj.tdsScored||0)+1;
          obj.tdsScored = tdsScored;
          if(!obj.tdsNeeded||tdsScored>=(obj.tdsNeeded||1)) obj.complete = true;
        }
        if(isTurnover) obj.failed = true;
        break;
      case "no_turnover":
        obj.playsCompleted = playsUsed;
        if(isTurnover) obj.failed = true;
        else if(playsUsed>=obj.playsNeeded) obj.complete = true;
        break;
      case "third_down":
        if(down===3) {
          if(yards>=(yardsToGo)) { obj.streak=(obj.streak||0)+1; if(obj.streak>=obj.needed) obj.complete=true; }
          else obj.failed = true;
        }
        break;
      case "fourth_down":
        if(down===4) {
          if(yards>=(yardsToGo)||isTD) { obj.streak=(obj.streak||0)+1; if(obj.streak>=obj.needed) obj.complete=true; }
          else obj.failed = true;
        }
        break;
      case "big_play":
        if(yards>=obj.yardsNeeded) obj.complete = true;
        else if(playsUsed>=(obj.playsAllowed||5)) obj.failed = true;
        break;
    }

    setGauntlet(prev=>({...prev, obj}));
    return obj;
  }

  function finishGauntletLevel(obj) {
    if(!gauntlet) return;
    if(obj.complete) {
      // Level passed — calculate score then show upgrade
      const levelScore = gauntletScore(gauntlet.level, gauntlet.playsThisObj||0, obj.playsAllowed||5, 1);
      const newTotal = gauntlet.totalScore + levelScore;
      setGauntlet(prev=>({...prev, totalScore:newTotal, levelScore, obj, upgradePending:true}));
      setGauntletPhase("upgrade");
      playSound("touchdown");
    } else {
      // Failed — game over
      setGauntletPhase("gameover");
      playSound("turnover");
    }
  }

  function advanceGauntletLevel(chosenPlayer=null) {
    if(!gauntlet) return;
    const nextLevel = gauntlet.level + 1;
    let roster = {...gauntlet.playerRoster};
    if(chosenPlayer) {
      const starters = [...roster.starters];
      const overall = p=>(p.primary+p.secondary+p.speed+p.awareness)/4;
      // Only replace a C-tier player at the same position — never touch S/A/B picks
      const samePosCTier = starters
        .map((p,i)=>({p,i}))
        .filter(({p})=>p.pos===chosenPlayer.pos && p.tier==="C");
      if(samePosCTier.length>0) {
        const worst = samePosCTier.sort((a,b)=>overall(a.p)-overall(b.p))[0];
        starters[worst.i] = chosenPlayer;
        roster = {starters, bench:[]};
      }
    }
    const newObj = generateObjective(nextLevel, gauntlet.lastObjType);
    const aiRoster = buildGauntletAIRoster(nextLevel);
    const newGauntlet = {...gauntlet, level:nextLevel, obj:newObj, lastObjType:newObj.type,
      playerRoster:roster, playsThisObj:0, upgradePending:false, levelScore:0};
    setGauntlet(newGauntlet);
    launchGauntletLevel(newGauntlet, roster, aiRoster, newObj);
  }

  async function submitGauntletScore(name) {
    if(!gauntlet) return;
    const entry = {
      name: name||"Anonymous",
      score: gauntlet.totalScore,
      level: gauntlet.level,
      team: gauntlet.teamName||teamName,
    };
    const lb = await loadLeaderboard();
    const newLb = addToLeaderboard(lb, entry);
    await saveLeaderboard(newLb);
    setLeaderboard(newLb);
    setGauntletPhase("leaderboard");
  }

  // Generate 3 upgrade options — offer players better than the weakest at each position
  function getUpgradeOptions(roster, level) {
    const pool = buildGauntletDraftPool();
    const takenIds = roster.starters.map(p=>p.id);
    const overall = p=>(p.primary+p.secondary+p.speed+p.awareness)/4;
    // Find positions that have at least one C-tier player (replaceable slot)
    const replaceablePos = new Set(
      roster.starters.filter(p=>p.tier==="C").map(p=>p.pos)
    );
    // Offer any non-taken offense player that:
    // 1. Is not C-tier (actual upgrade)
    // 2. Has a replaceable slot in the roster (C-tier at same position)
    // 3. Is better than current minimum quality floor
    const avail = pool
      .filter(p=>!takenIds.includes(p.id))
      .filter(p=>p.side==="offense")
      .filter(p=>p.tier!=="C")
      .filter(p=>replaceablePos.has(p.pos))
      .sort(()=>Math.random()-0.5);
    // Try to offer variety of positions
    const seen = new Set(); const opts = [];
    for(const p of avail) {
      if(opts.length>=3) break;
      if(!seen.has(p.pos)) { seen.add(p.pos); opts.push(p); }
    }
    // Fill any remaining slots with best available
    for(const p of avail) {
      if(opts.length>=3) break;
      if(!opts.includes(p)) opts.push(p);
    }
    // If still nothing (all positions already maxed out), offer any non-taken upgrade
    if(opts.length===0) {
      const fallback = pool
        .filter(p=>!takenIds.includes(p.id)&&p.side==="offense"&&p.tier!=="C")
        .sort(()=>Math.random()-0.5)
        .slice(0,3);
      return fallback;
    }
    return opts.slice(0,3);
  }

  function playerDraftPick(player) {
    setG(prev=>{
      if(!prev._playoffDraft&&draftPickOwner(prev.draftPick)!==0) return prev;
      const isGauntletDraft = prev._gauntletDraft||false;
      const newStarters=[...prev.playerRoster.starters,player];
      const newR={starters:newStarters,bench:[]};
      const next=prev.draftPick+1;
      const draftLimit = isGauntletDraft ? GAUNTLET_PICKS : prev._playoffDraft ? DRAFT_PICKS : 16;
      if(next>=draftLimit) {
        const allTaken=newStarters.map(p=>p.id);
        // Gauntlet: only auto-fill offense, no defense needed
        const filledPlayer = isGauntletDraft
          ? {starters:autoFillRoster(newStarters,prev.draftPool,allTaken,GAUNTLET_FULL_OFFENSE,0),bench:[]}
          : {starters:autoFillRoster(newStarters,prev.draftPool,allTaken,FULL_OFFENSE,FULL_DEFENSE),bench:[]};
        const filledAI=prev.mode==="online"?{starters:[],bench:[]}:{starters:autoFillRoster(prev.aiRoster.starters,prev.draftPool,[...filledPlayer.starters,...prev.aiRoster.starters].map(p=>p.id),FULL_OFFENSE,FULL_DEFENSE),bench:[]};
        // Gauntlet: launch first level instead of coin toss
        if(prev.mode==="gauntlet") {
          setTimeout(()=>startGauntlet(filledPlayer),50);
          return{...prev,playerRoster:filledPlayer,draftPick:next,draftOptions:[],phase:"play_call_offense"};
        }
        return{...prev,playerRoster:filledPlayer,aiRoster:filledAI,draftPick:next,draftOptions:[],phase:"coin_toss",gameLog:[`🏈 ${prev.teams.away} vs ${prev.teams.home}`]};
      }
      if(prev._playoffDraft||draftPickOwner(next)===0) {
        const taken=[...newStarters,...prev.aiRoster.starters].map(p=>p.id);
        const tc=rosterTierCount(newStarters);
        const pOff=newStarters.filter(p=>p.side==="offense").length;
        const pDef=newStarters.filter(p=>p.side==="defense").length;
        const opts=buildDraftOptions(prev.draftPool,taken,
          isGauntletDraft ? pOff<FULL_OFFENSE : pOff<4,
          isGauntletDraft ? false : pDef<4,
          tc,3,isGauntletDraft);
        return{...prev,playerRoster:newR,draftPick:next,draftOptions:opts};
      }
      return{...prev,playerRoster:newR,draftPick:next,draftOptions:[]};
    });
  }
  function resetGame() {
    setTeamName(TEAM_NAMES[0]); setAiTeamName(TEAM_NAMES[1]);
    setPlayerColorIdx(0); setAiColorIdx(1); setMinutesPerQuarter(4);
    setOnlineState("idle"); setRoomCode(""); setRoomInput(""); setOnlineError(""); setOnlineSide(null);
    setG(initGame());
  }

  // ── STYLES ────────────────────────────────────────────────────────────────
  const root={minHeight:"100vh",background:"linear-gradient(160deg,#060d1a 0%,#0a1628 50%,#080d06 100%)",color:"#f8fafc",fontFamily:"'Inter','Segoe UI',sans-serif",display:"flex",flexDirection:"column",alignItems:"center",paddingBottom:8,padding:"12px 0 8px",overflowX:"hidden"};
  const card={background:"linear-gradient(180deg,#161f2e 0%,#111827 100%)",border:"1px solid #253046",borderRadius:12,padding:14,width:"100%",maxWidth:580,boxSizing:"border-box",margin:"0 8px",boxShadow:"0 2px 12px rgba(0,0,0,0.4)"};
  const lbl={fontSize:10,color:"#7c8fa8",textTransform:"uppercase",letterSpacing:1,marginBottom:5};
  const btn=(color="#E63946")=>({background:`linear-gradient(135deg,${color},${color}cc)`,color:"#fff",border:`1px solid ${color}`,borderRadius:10,padding:"12px 20px",fontWeight:800,fontSize:14,cursor:"pointer",width:"100%",letterSpacing:0.5,boxShadow:`0 2px 10px ${color}44`});
  const offBtn=(color,selected)=>({background:selected?`linear-gradient(135deg,${color},${color}bb)`:"#141d2e",border:`2px solid ${selected?color:"#253046"}`,color:selected?"#fff":"#7c8fa8",borderRadius:8,padding:"8px 6px",fontWeight:700,fontSize:12,cursor:"pointer",flex:1,minWidth:70,boxShadow:selected?`0 2px 8px ${color}55`:"none",transition:"all 0.15s"});

  const playerSide=g.playerSide;
  const playerHasBall=g.possession===playerSide;
  const playerOnDef=g.possession!==playerSide;
  const playerColor=g.teamColors[playerSide]?.primary||"#E63946";
  const isOnline=g.mode==="online";
  const isGauntlet=g.mode==="gauntlet";

  // Gauntlet HUD — shown above scoreboard in all play phases
  const GauntletHUD = isGauntlet&&gauntlet ? (
    <div style={{width:"100%",maxWidth:580,padding:"8px 10px 0",boxSizing:"border-box"}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <div style={{background:"linear-gradient(135deg,#f59e0b,#d97706)",borderRadius:6,padding:"3px 10px"}}>
            <span style={{fontSize:11,fontWeight:900,color:"#1a0a00"}}>LVL {gauntlet.level}</span>
          </div>
          <span style={{fontSize:10,color:"#64748b"}}>Play {(gauntlet.playsThisObj||0)+1}</span>
        </div>
        <div style={{fontSize:13,fontWeight:900,color:"#f59e0b"}}>{gauntlet.totalScore?.toLocaleString()||0} pts</div>
      </div>
      <ObjectiveCard obj={gauntlet.obj} compact/>
    </div>
  ) : null;

  // In online mode, show controls only when it's this player's turn (_turn === onlineSide)
  // Control visibility uses possession-based logic
  const myOnlineTurn = isOnline && g._turn===onlineSide;
  const showOffenseControls = isOnline ? (myOnlineTurn && g._turn===g.possession) : playerHasBall;
  const showDefenseControls = isOnline ? (myOnlineTurn && g._turn!==g.possession) : playerOnDef;
  const waitingForOpponent = isOnline && !myOnlineTurn;

  // ── GAUNTLET EARLY INTERCEPTS (must come before menu/game phase checks) ──────
  // These fire when gauntletPhase is set regardless of g.phase

  if(gauntletPhase==="gameover"&&gauntlet) {
    const color = TEAM_PALETTE[gauntlet.colorIdx||0].primary;
    return (
      <div style={root}>
        <div style={{...card,maxWidth:440,margin:"12px auto 0",textAlign:"center"}}>
          <div style={{fontSize:40,marginBottom:6}}>💀</div>
          <div style={{fontSize:24,fontWeight:900,color:"#f87171",marginBottom:2}}>Gauntlet Over!</div>
          <div style={{fontSize:13,color:"#64748b",marginBottom:14}}>Failed on Level {gauntlet.level}</div>
          <div style={{background:"#111827",border:"1px solid #1e293b",borderRadius:10,padding:"12px 14px",marginBottom:14}}>
            <ObjectiveCard obj={gauntlet.obj} compact/>
            <div style={{marginTop:12,display:"flex",justifyContent:"space-around",borderTop:"1px solid #1e293b",paddingTop:12}}>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:10,color:"#64748b",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Level Reached</div>
                <div style={{fontSize:36,fontWeight:900,color}}>{gauntlet.level}</div>
              </div>
              <div style={{width:1,background:"#1e293b"}}/>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:10,color:"#64748b",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>Final Score</div>
                <div style={{fontSize:36,fontWeight:900,color:"#f59e0b"}}>{(gauntlet.totalScore||0).toLocaleString()}</div>
              </div>
            </div>
          </div>
          <div style={{marginBottom:14}}>
            <div style={{fontSize:12,color:"#64748b",marginBottom:6}}>Enter your name for the leaderboard:</div>
            <input value={gauntletName} onChange={e=>setGauntletName(e.target.value)}
              placeholder="Your name" maxLength={20}
              style={{width:"100%",background:"#0f172a",border:"1px solid #334155",color:"#f8fafc",borderRadius:8,padding:"10px 12px",fontSize:14,outline:"none",boxSizing:"border-box",marginBottom:8}}/>
            <button style={btn("#f59e0b")} onClick={()=>submitGauntletScore(gauntletName)}>
              📊 Submit to Leaderboard
            </button>
          </div>
          <div style={{display:"flex",gap:8}}>
            <button style={{flex:1,background:"#1e293b",border:"1px solid #334155",color:"#94a3b8",borderRadius:10,padding:"12px",fontWeight:700,fontSize:13,cursor:"pointer"}}
              onClick={()=>{ setGauntlet(null); setGauntletPhase("idle"); setG(initGame()); }}>
              ← Main Menu
            </button>
            <button style={{...btn(color),flex:1}} onClick={()=>{ setGauntlet(null); setGauntletPhase("draft"); setG(initGame()); }}>
              🔄 Play Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if(gauntletPhase==="upgrade"&&gauntlet) {
    const opts = getUpgradeOptions(gauntlet.playerRoster, gauntlet.level);
    const color = TEAM_PALETTE[gauntlet.colorIdx||0].primary;
    return (
      <div style={root}>
        <div style={{width:"100%",maxWidth:580,padding:"14px 16px 0",boxSizing:"border-box"}}>
          <div style={{textAlign:"center",marginBottom:14}}>
            <div style={{display:"inline-block",background:"linear-gradient(135deg,#f59e0b,#d97706)",borderRadius:10,padding:"6px 16px",marginBottom:8}}>
              <span style={{fontSize:13,fontWeight:900,color:"#1a0a00"}}>LEVEL {gauntlet.level} COMPLETE! ✅</span>
            </div>
            <div style={{fontSize:28,fontWeight:900,color:"#f59e0b",marginBottom:2}}>+{(gauntlet.levelScore||0).toLocaleString()} pts</div>
            <div style={{fontSize:13,color:"#64748b"}}>Total: <span style={{color:"#f8fafc",fontWeight:700}}>{(gauntlet.totalScore||0).toLocaleString()}</span></div>
          </div>
          <ObjectiveCard obj={{...gauntlet.obj,complete:true}} compact/>
          <div style={{marginTop:14,marginBottom:8}}>
            <div style={{fontSize:14,fontWeight:800,marginBottom:4}}>⬆️ Upgrade Your Roster</div>
            <div style={{fontSize:12,color:"#64748b",marginBottom:8}}>Pick a player — replaces the weakest at their position. Or skip.</div>
            {/* Current roster collapsible */}
            <div style={{marginBottom:10}}>
              <button onClick={()=>setShowGauntletRoster(s=>!s)}
                style={{background:"#0f172a",border:`1px solid ${showGauntletRoster?color:"#1e293b"}`,color:showGauntletRoster?color:"#475569",borderRadius:8,padding:"6px 12px",fontSize:11,fontWeight:700,cursor:"pointer",width:"100%",marginBottom:6}}>
                {showGauntletRoster?"▲ Hide Current Roster":"📋 View Current Roster"}
              </button>
              {showGauntletRoster&&<RosterPanel roster={gauntlet.playerRoster} color={color} onClose={()=>setShowGauntletRoster(false)}/>}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:8}}>
              {opts.map(p=>(
                <div key={p.id} onClick={()=>advanceGauntletLevel(p)}
                  style={{background:"#0f172a",border:`2px solid #1e293b`,borderRadius:12,padding:"10px 12px",cursor:"pointer"}}
                  onMouseEnter={e=>e.currentTarget.style.borderColor=color}
                  onMouseLeave={e=>e.currentTarget.style.borderColor="#1e293b"}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:6}}>
                    <div>
                      <div style={{fontWeight:800,fontSize:14}}>{p.name}</div>
                      <div style={{fontSize:11,color:"#64748b"}}>{p.pos} · {p.side==="offense"?"⚡ Offense":"🛡️ Defense"}</div>
                    </div>
                    <TierBadge tier={p.tier}/>
                  </div>
                  {p.side==="offense"?(
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"3px 8px"}}>
                      {[["PRI",p.primary,"#60a5fa"],["SEC",p.secondary,"#E63946"],["SPD",p.speed,"#E9C46A"],["AWR",p.awareness,"#2A9D8F"]].map(([l,v,c])=>(
                        <div key={l}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:8,color:"#64748b"}}>{l}</span><span style={{fontSize:8,color:"#94a3b8"}}>{v}</span></div><StatBar value={v} color={c}/></div>
                      ))}
                    </div>
                  ):(
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"3px 8px"}}>
                      {[["RUSH",p.pass_rush,"#E63946"],["COV",p.coverage,"#60a5fa"],["TCK",p.tackle,"#34d399"],["INS",p.instinct,"#f59e0b"]].map(([l,v,c])=>(
                        <div key={l}><div style={{display:"flex",justifyContent:"space-between"}}><span style={{fontSize:8,color:"#64748b"}}>{l}</span><span style={{fontSize:8,color:"#94a3b8"}}>{v}</span></div><StatBar value={v} color={c}/></div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <button onClick={()=>advanceGauntletLevel(null)}
                style={{background:"#1e293b",border:"1px solid #334155",color:"#64748b",borderRadius:10,padding:"12px",fontWeight:700,fontSize:13,cursor:"pointer"}}>
                Skip → Level {gauntlet.level+1}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if(gauntletPhase==="draft"&&g.phase!=="draft") {
    return (
      <div style={root}>
        <div style={{...card,maxWidth:400,margin:"12px auto 0",textAlign:"center"}}>
          <div style={{fontSize:36,marginBottom:6}}>🏆</div>
          <div style={{fontWeight:900,fontSize:20,marginBottom:2}}>Gauntlet Mode</div>
          <div style={{fontSize:12,color:"#64748b",marginBottom:14}}>Survive as many levels as you can!</div>

          {/* Team name */}
          <div style={{textAlign:"left",marginBottom:12}}>
            <div style={{fontSize:10,color:"#7c8fa8",textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>Your Team</div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <div style={{fontSize:18,fontWeight:900,color:TEAM_PALETTE[playerColorIdx].primary,flex:1}}>{teamName}</div>
              <button onClick={()=>setShowTeamDrop(s=>!s)} style={{background:"#1e293b",border:"1px solid #334155",color:"#64748b",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:16,lineHeight:1}}>{showTeamDrop?"▲":"▾"}</button>
            </div>
            {showTeamDrop&&(
              <select autoFocus style={{width:"100%",background:"#1e293b",border:"1px solid #334155",color:"#f8fafc",borderRadius:8,padding:"10px 14px",fontSize:14,boxSizing:"border-box",appearance:"none",cursor:"pointer",outline:"none",marginBottom:6}}
                value={teamName} onChange={e=>{setTeamName(e.target.value);setShowTeamDrop(false);}}>
                {TEAM_NAMES.map(n=><option key={n} value={n} style={{background:"#1e293b"}}>{n}</option>)}
              </select>
            )}
          </div>

          {/* Team color */}
          <div style={{textAlign:"left",marginBottom:12}}>
            <div style={{fontSize:10,color:"#7c8fa8",textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>Team Color</div>
            <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
              {TEAM_PALETTE.map((_,i)=>(
                <div key={i} onClick={()=>setPlayerColorIdx(i)}
                  style={{width:28,height:28,borderRadius:"50%",background:TEAM_PALETTE[i].primary,border:playerColorIdx===i?"3px solid #f8fafc":"3px solid transparent",cursor:"pointer",flexShrink:0}}/>
              ))}
            </div>
          </div>

          {/* Draft Y/N */}
          <div style={{textAlign:"left",marginBottom:14}}>
            <div style={{fontSize:10,color:"#7c8fa8",textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>Draft Your Team?</div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setSkipDraft(false)}
                style={{flex:1,background:!skipDraft?TEAM_PALETTE[playerColorIdx].primary+"33":"#1e293b",border:`2px solid ${!skipDraft?TEAM_PALETTE[playerColorIdx].primary:"#334155"}`,color:!skipDraft?TEAM_PALETTE[playerColorIdx].primary:"#94a3b8",borderRadius:8,padding:"10px 0",fontWeight:800,fontSize:14,cursor:"pointer"}}>
                ✅ Yes
                <div style={{fontSize:9,fontWeight:400,color:"#64748b",marginTop:1}}>Pick your offense</div>
              </button>
              <button onClick={()=>setSkipDraft(true)}
                style={{flex:1,background:skipDraft?TEAM_PALETTE[playerColorIdx].primary+"33":"#1e293b",border:`2px solid ${skipDraft?TEAM_PALETTE[playerColorIdx].primary:"#334155"}`,color:skipDraft?TEAM_PALETTE[playerColorIdx].primary:"#94a3b8",borderRadius:8,padding:"10px 0",fontWeight:800,fontSize:14,cursor:"pointer"}}>
                🎲 No
                <div style={{fontSize:9,fontWeight:400,color:"#64748b",marginTop:1}}>Random team</div>
              </button>
            </div>
          </div>

          <button style={btn("#f59e0b")} onClick={()=>{
            if(skipDraft) {
              const pool=buildGauntletDraftPool();
              // Random roster: 1S + 2A + 2B active picks, rest C-tier fill
              const usedIds = new Set();
              const active = [];
              for(const [tier,count] of [["S",1],["A",2],["B",2]]) {
                const candidates = pool.filter(p=>p.tier===tier&&!usedIds.has(p.id)).sort(()=>Math.random()-0.5);
                candidates.slice(0,count).forEach(p=>{ active.push(p); usedIds.add(p.id); });
              }
              const filled = autoFillRoster(active, pool, [...usedIds], GAUNTLET_FULL_OFFENSE, 0);
              const roster={starters:filled,bench:[]};
              setG({...initGame(),mode:"gauntlet",phase:"play_call_offense",playerSide:"away",
                teams:{away:teamName,home:"Gauntlet"},
                teamColors:{away:TEAM_PALETTE[playerColorIdx],home:TEAM_PALETTE[6]},
              });
              setTimeout(()=>startGauntlet(roster),50);
            } else {
              const pool=buildGauntletDraftPool();
              const firstOptions=buildDraftOptions(pool,[],true,false,{S:0,A:0,B:0,C:0},3,true);
              setG({...initGame(),mode:"gauntlet",phase:"draft",_playoffDraft:true,_gauntletDraft:true,playerSide:"away",
                draftPool:pool,draftPick:0,draftOptions:firstOptions,
                playerRoster:{starters:[],bench:[]},aiRoster:{starters:[],bench:[]},
                teams:{away:teamName,home:"Gauntlet"},
                teamColors:{away:TEAM_PALETTE[playerColorIdx],home:TEAM_PALETTE[6]},
              });
            }
          }}>{skipDraft?"Play Now 🎲":"Start Draft →"}</button>
          <button style={{...btn("#475569"),marginTop:8,fontSize:12}} onClick={()=>setGauntletPhase("idle")}>← Back</button>
        </div>
      </div>
    );
  }

  if(gauntletPhase==="leaderboard") {
    const tabs=["daily","weekly","allTime"];
    const entries=leaderboard[lbTab]||[];
    const tabLabel={daily:"Today",weekly:"This Week",allTime:"All Time"};
    return (
      <div style={root}>
        <div style={{width:"100%",maxWidth:580,padding:"14px 16px 0",boxSizing:"border-box"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
            <div style={{fontSize:20,fontWeight:900}}>📊 Leaderboard</div>
            <button onClick={()=>{setGauntletPhase("idle");}}
              style={{background:"#1e293b",border:"1px solid #334155",color:"#94a3b8",borderRadius:8,padding:"6px 12px",fontSize:12,fontWeight:700,cursor:"pointer"}}>← Menu</button>
          </div>
          <div style={{display:"flex",gap:4,marginBottom:14,background:"#0f172a",borderRadius:10,padding:4}}>
            {tabs.map(t=>(
              <button key={t} onClick={()=>setLbTab(t)}
                style={{flex:1,background:lbTab===t?"#1e293b":"transparent",border:"none",color:lbTab===t?"#f8fafc":"#475569",borderRadius:7,padding:"8px 4px",fontSize:12,fontWeight:700,cursor:"pointer"}}>
                {tabLabel[t]}
              </button>
            ))}
          </div>
          {entries.length===0?(
            <div style={{textAlign:"center",color:"#475569",padding:"32px 0",fontSize:13}}>
              No scores yet — play Gauntlet Mode to get on the board!
            </div>
          ):(
            <div style={{background:"#0f172a",borderRadius:10,overflow:"hidden"}}>
              <div style={{display:"grid",gridTemplateColumns:"28px 1fr 70px 60px",gap:"0 8px",padding:"6px 12px",borderBottom:"1px solid #1e293b",fontSize:9,color:"#475569",textTransform:"uppercase",letterSpacing:0.5}}>
                <div>#</div><div>Player</div><div style={{textAlign:"center"}}>Score</div><div style={{textAlign:"center"}}>Level</div>
              </div>
              {entries.map((e,i)=>{
                const medal=i===0?"🥇":i===1?"🥈":i===2?"🥉":null;
                return(
                  <div key={i} style={{display:"grid",gridTemplateColumns:"28px 1fr 70px 60px",gap:"0 8px",padding:"8px 12px",borderBottom:"1px solid #0f172a",background:i===0?"#0f2744":"transparent",alignItems:"center"}}>
                    <div style={{fontSize:14}}>{medal||<span style={{fontSize:11,color:"#475569"}}>{i+1}</span>}</div>
                    <div>
                      <div style={{fontWeight:700,fontSize:13,color:i===0?"#f8fafc":"#94a3b8"}}>{e.name}</div>
                      <div style={{fontSize:10,color:"#475569"}}>{e.team} · {new Date(e.date).toLocaleDateString()}</div>
                    </div>
                    <div style={{textAlign:"center",fontWeight:900,fontSize:14,color:"#f59e0b"}}>{e.score?.toLocaleString()}</div>
                    <div style={{textAlign:"center",fontWeight:700,fontSize:14,color:"#60a5fa"}}>Lv.{e.level}</div>
                  </div>
                );
              })}
            </div>
          )}
          <div style={{marginTop:14}}>
            <button style={btn("#f59e0b")} onClick={()=>setGauntletPhase("draft")}>
              🏆 Play Gauntlet
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── MENU ──────────────────────────────────────────────────────────────────
  if(g.phase==="menu") return (
    <div style={root}>
      <div style={{...card,maxWidth:400,margin:"8px auto 0",textAlign:"center"}}>
        <div style={{background:"linear-gradient(135deg,#0a1f0a,#1a2a3f,#0a0f1a)",borderRadius:12,padding:"10px 16px 8px",marginBottom:10}}>
          <div style={{fontSize:32,marginBottom:2}}>🏈</div>
          <div style={{fontSize:22,fontWeight:900,letterSpacing:-1,marginBottom:2,background:"linear-gradient(135deg,#f59e0b,#E63946,#60a5fa)",WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent"}}>Gridiron Gamble</div>
          <div style={{color:"#64748b",fontSize:12}}>Draft · Read · Snap · Score</div>
        </div>
        <div style={{background:"#111827",border:"1px solid #1e293b",borderRadius:10,padding:"10px 12px",marginBottom:10,textAlign:"left"}}>
          <div style={{fontSize:10,color:"#64748b",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>How to Play</div>
          {[["🎯","Draft","Pick offense + defense (rest auto-filled)"],["📋","Coin Toss","Determines who receives the kickoff"],["🏃","Call Plays","Offense picks a play; defense picks scheme"],["🔍","Read Defense","Guess the defense call for a stat boost"],["🎲","Snap!","Dice roll — offense vs defense + luck"],["🏆","Drive","First downs, TDs, manage the clock"]].map(([i,t,d])=>(
            <div key={t} style={{display:"flex",gap:6,alignItems:"flex-start",marginBottom:4}}>
              <span style={{fontSize:13}}>{i}</span>
              <div><span style={{fontWeight:700,color:"#f8fafc",fontSize:11}}>{t}: </span><span style={{color:"#64748b",fontSize:11}}>{d}</span></div>
            </div>
          ))}
        </div>
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          <button style={btn("#E63946")} onClick={()=>startGame("vs-ai")}>🤖 Play vs AI</button>
          <button style={btn("#22c55e")} onClick={()=>setG(prev=>({...prev,phase:"online_lobby",mode:"online"}))}>🌐 Play Online</button>
          <button style={btn("#f59e0b")} onClick={()=>setGauntletPhase("draft")}>🏆 Gauntlet Mode</button>
          <button style={{...btn("#475569"),fontSize:12}} onClick={async()=>{
            const lb=await loadLeaderboard(); setLeaderboard(lb); setGauntletPhase("leaderboard");
          }}>📊 Leaderboard</button>
        </div>
      </div>
    </div>
  );

  if(g.phase==="setup") {
    const sel={width:"100%",background:"#1e293b",border:"1px solid #334155",color:"#f8fafc",borderRadius:8,padding:"10px 14px",fontSize:15,boxSizing:"border-box",appearance:"none",cursor:"pointer"};
    const ColorSwatch=({idx,selected,onClick})=>(
      <div onClick={onClick} style={{width:28,height:28,borderRadius:"50%",background:TEAM_PALETTE[idx].primary,border:selected?"3px solid #f8fafc":"3px solid transparent",cursor:"pointer",flexShrink:0}}/>
    );
    return (
      <div style={root}>
        <div style={{...card,maxWidth:420,margin:"12px auto 0"}}>
          <div style={{fontSize:20,fontWeight:800,marginBottom:12}}>Game Setup</div>
          {/* Your Team */}
          <div style={{marginBottom:12}}>
            <div style={lbl}>Your Team</div>
            <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
              <div style={{fontSize:18,fontWeight:900,color:TEAM_PALETTE[playerColorIdx].primary,flex:1}}>{teamName}</div>
              <button onClick={()=>setShowTeamDrop(s=>!s)} style={{background:"#1e293b",border:"1px solid #334155",color:"#64748b",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:16,lineHeight:1}}>{showTeamDrop?"▲":"▾"}</button>
            </div>
            {showTeamDrop&&(
              <select autoFocus style={{...sel,marginBottom:6}} value={teamName} onChange={e=>{setTeamName(e.target.value);setShowTeamDrop(false);}}>
                {TEAM_NAMES.map(n=><option key={n} value={n}>{n}</option>)}
              </select>
            )}
            <div style={{display:"flex",gap:5}}>{TEAM_PALETTE.map((_,i)=><ColorSwatch key={i} idx={i} selected={playerColorIdx===i} onClick={()=>setPlayerColorIdx(i)}/>)}</div>
          </div>
          {g.mode==="vs-ai"&&(
            <div style={{marginBottom:12}}>
              <div style={lbl}>Opponent</div>
              <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                <div style={{fontSize:18,fontWeight:900,color:TEAM_PALETTE[aiColorIdx].primary,flex:1}}>{aiTeamName}</div>
                <button onClick={()=>setShowAiTeamDrop(s=>!s)} style={{background:"#1e293b",border:"1px solid #334155",color:"#64748b",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:16,lineHeight:1}}>{showAiTeamDrop?"▲":"▾"}</button>
              </div>
              {showAiTeamDrop&&(
                <select autoFocus style={{...sel,marginBottom:6}} value={aiTeamName} onChange={e=>{setAiTeamName(e.target.value);setShowAiTeamDrop(false);}}>
                  {TEAM_NAMES.filter(n=>n!==teamName).map(n=><option key={n} value={n}>{n}</option>)}
                </select>
              )}
              <div style={{display:"flex",gap:5}}>{TEAM_PALETTE.map((_,i)=><ColorSwatch key={i} idx={i} selected={aiColorIdx===i} onClick={()=>setAiColorIdx(i)}/>)}</div>
            </div>
          )}
          <div style={{marginBottom:12}}>
            <div style={lbl}>Minutes Per Quarter</div>
            <div style={{display:"flex",gap:8}}>
              {[3,5,10,15].map(n=>(
                <button key={n} onClick={()=>setMinutesPerQuarter(n)}
                  style={{flex:1,background:minutesPerQuarter===n?TEAM_PALETTE[playerColorIdx].primary+"33":"#1e293b",border:`2px solid ${minutesPerQuarter===n?TEAM_PALETTE[playerColorIdx].primary:"#334155"}`,color:minutesPerQuarter===n?TEAM_PALETTE[playerColorIdx].primary:"#94a3b8",borderRadius:8,padding:"8px 0",fontWeight:800,fontSize:15,cursor:"pointer"}}>
                  {n}
                  <div style={{fontSize:9,fontWeight:400,color:"#64748b",marginTop:1}}>min/qtr</div>
                </button>
              ))}
            </div>
          </div>
          <div style={{marginBottom:14}}>
            <div style={lbl}>Draft</div>
            <div style={{display:"flex",gap:8}}>
              <button onClick={()=>setSkipDraft(false)}
                style={{flex:1,background:!skipDraft?TEAM_PALETTE[playerColorIdx].primary+"33":"#1e293b",border:`2px solid ${!skipDraft?TEAM_PALETTE[playerColorIdx].primary:"#334155"}`,color:!skipDraft?TEAM_PALETTE[playerColorIdx].primary:"#94a3b8",borderRadius:8,padding:"10px 0",fontWeight:800,fontSize:14,cursor:"pointer"}}>
                ✅ Yes
                <div style={{fontSize:9,fontWeight:400,color:"#64748b",marginTop:1}}>Pick your roster</div>
              </button>
              <button onClick={()=>setSkipDraft(true)}
                style={{flex:1,background:skipDraft?TEAM_PALETTE[playerColorIdx].primary+"33":"#1e293b",border:`2px solid ${skipDraft?TEAM_PALETTE[playerColorIdx].primary:"#334155"}`,color:skipDraft?TEAM_PALETTE[playerColorIdx].primary:"#94a3b8",borderRadius:8,padding:"10px 0",fontWeight:800,fontSize:14,cursor:"pointer"}}>
                🎲 No
                <div style={{fontSize:9,fontWeight:400,color:"#64748b",marginTop:1}}>Random teams</div>
              </button>
            </div>
          </div>
          <div style={{display:"flex",gap:8,alignItems:"stretch"}}>
            <button style={{background:"#1e293b",border:"1px solid #334155",color:"#94a3b8",borderRadius:10,padding:"12px 14px",fontWeight:700,fontSize:13,cursor:"pointer",whiteSpace:"nowrap",flexShrink:0}} onClick={()=>setG(prev=>({...prev,phase:"menu"}))}>← Back</button>
            <button style={{...btn(TEAM_PALETTE[playerColorIdx].primary),flex:1}} onClick={()=>{
              const pC=TEAM_PALETTE[playerColorIdx], aC2=TEAM_PALETTE[aiColorIdx];
              if(skipDraft) {
                beginRandomGame(teamName,aiTeamName||"Opponents","away",pC,aC2,minutesPerQuarter);
              } else {
                beginDraft(teamName,aiTeamName||"Opponents","away",pC,aC2,minutesPerQuarter);
              }
            }}>{skipDraft?"Play Now 🎲":"Start Draft →"}</button>
          </div>
        </div>
      </div>
    );
  }

  // ── DRAFT ─────────────────────────────────────────────────────────────────
  if(g.phase==="draft") {
    const isMyTurn=g._playoffDraft||draftPickOwner(g.draftPick)===0;
    const round=Math.floor(g.draftPick/2)+1;
    const myStarters=g.playerRoster.starters;
    const offCount=myStarters.filter(p=>p.side==="offense").length;
    const defCount=myStarters.filter(p=>p.side==="defense").length;
    const tierCount=rosterTierCount(myStarters);
    const accent=playerColor;
    const options=g.draftOptions||[];
    const OFF_POSITIONS=["QB","RB","RB","WR","WR","WR","TE","OL"];
    const DEF_POSITIONS=["DL","DL","LB","LB","CB","CB","S"];
    return (
      <div style={root}>
        <div style={{width:"100%",maxWidth:580,padding:"14px 16px 0",boxSizing:"border-box"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:10}}>
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <button onClick={()=>{
                if(g.mode==="gauntlet"){setGauntletPhase("draft");} else {setG(prev=>({...prev,phase:"setup"}));}
                setG(initGame());
              }} style={{background:"#1e293b",border:"1px solid #334155",color:"#94a3b8",borderRadius:7,padding:"5px 10px",fontSize:12,fontWeight:700,cursor:"pointer"}}>← Back</button>
              <div><div style={{fontWeight:800,fontSize:16}}>Snake Draft</div><div style={{fontSize:12,color:"#64748b"}}>Pick {g.draftPick+1} of {g._gauntletDraft?GAUNTLET_PICKS:g._playoffDraft?DRAFT_PICKS:16}{g._gauntletDraft?" · Offense Only":""}</div></div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:13,fontWeight:700,color:isMyTurn?accent:"#94a3b8"}}>{isMyTurn?"⬅ Your Pick":"⏳ AI Picking…"}</div>
              <div style={{fontSize:11,color:"#64748b"}}>
                {g._gauntletDraft
                  ? <><span style={{color:"#f59e0b"}}>S {tierCount.S}/{GAUNTLET_TIER_LIMITS.S}</span> · <span style={{color:"#60a5fa"}}>A {tierCount.A}/{GAUNTLET_TIER_LIMITS.A}</span> · <span style={{color:"#34d399"}}>B {tierCount.B}/{GAUNTLET_TIER_LIMITS.B}</span></>
                  : <><span style={{color:"#f59e0b"}}>S {tierCount.S}/{DRAFT_TIER_LIMITS.S}</span> · <span style={{color:"#60a5fa"}}>A {tierCount.A}/{DRAFT_TIER_LIMITS.A}</span> · <span style={{color:"#34d399"}}>B {tierCount.B}/{DRAFT_TIER_LIMITS.B}</span></>
                }
              </div>
            </div>
          </div>
          {/* Roster tracker */}
          <div style={{background:"#111827",border:"1px solid #1e293b",borderRadius:10,padding:"10px 12px",marginBottom:10}}>
            <div style={{fontSize:11,color:"#64748b",textTransform:"uppercase",letterSpacing:1,marginBottom:6}}>
              {g._gauntletDraft
                ? `Your Picks (${GAUNTLET_PICKS} active picks · offense only · rest C-tier)`
                : "Your Picks (8 active picks, rest auto-filled with C-tier)"}
            </div>
            <div style={{marginBottom:6}}>
              <div style={{fontSize:9,color:"#64748b",marginBottom:4}}>OFFENSE</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                {(g._gauntletDraft ? GAUNTLET_OFF_SLOTS : OFF_POSITIONS).map((pos,i)=>{
                  const filled=myStarters.filter(p=>p.side==="offense")[i];
                  return <div key={i} style={{background:filled?accent+"33":"#0d1525",border:`1px solid ${filled?accent:"#1e2a3a"}`,borderRadius:6,padding:"3px 8px",fontSize:9,color:filled?accent:"#475569",fontWeight:700}}>
                    {filled?filled.pos:pos}
                    {filled&&<div style={{fontSize:8,color:"#94a3b8",fontWeight:400,maxWidth:40,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{filled.name.split(" ").slice(-1)[0]}</div>}
                  </div>;
                })}
              </div>
            </div>
            {!g._gauntletDraft&&(
            <div>
              <div style={{fontSize:9,color:"#64748b",marginBottom:4}}>DEFENSE</div>
              <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                {DEF_POSITIONS.map((pos,i)=>{
                  const filled=myStarters.filter(p=>p.side==="defense")[i];
                  return <div key={i} style={{background:filled?"#3b1f5e":"#0d1525",border:`1px solid ${filled?"#9b5de5":"#1e2a3a"}`,borderRadius:6,padding:"3px 8px",fontSize:9,color:filled?"#c084fc":"#475569",fontWeight:700}}>
                    {filled?filled.pos:pos}
                    {filled&&<div style={{fontSize:8,color:"#94a3b8",fontWeight:400,maxWidth:40,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{filled.name.split(" ").slice(-1)[0]}</div>}
                  </div>;
                })}
              </div>
            </div>
            )}
          </div>
          {isMyTurn ? (
            <div>
              <div style={{background:"#0f172a",borderRadius:8,padding:"8px 12px",marginBottom:10,fontSize:12,color:"#64748b",lineHeight:1.6}}>
                {g._gauntletDraft
                  ? <>Pick <span style={{color:"#f59e0b",fontWeight:700}}>1 S-tier</span> · <span style={{color:"#60a5fa",fontWeight:700}}>2 A-tier</span> · <span style={{color:"#34d399",fontWeight:700}}>2 B-tier</span> offense players ({GAUNTLET_PICKS} picks total). The rest are auto-filled with <span style={{color:"#94a3b8",fontWeight:700}}>C-tier</span> role players.</>
                  : <>Pick <span style={{color:"#f59e0b",fontWeight:700}}>2 S-tier</span> · <span style={{color:"#60a5fa",fontWeight:700}}>3 A-tier</span> · <span style={{color:"#34d399",fontWeight:700}}>3 B-tier</span>. Include both offense & defense.</>
                }
              </div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {options.map(p=>{
                  // Gauntlet: full when active picks (S+A+B) hit GAUNTLET_PICKS
                  const activePickCount = myStarters.filter(q=>q.tier!=="C").length;
                  const offFull = g._gauntletDraft
                    ? activePickCount >= GAUNTLET_PICKS
                    : offCount>=4&&p.side==="offense";
                  const defFull = g._gauntletDraft ? false : defCount>=4&&p.side==="defense";
                  const eligible=!offFull&&!defFull;
                  return (
                    <div key={p.id} style={{background:"#0f172a",border:`2px solid ${eligible?"#1e293b":"#0f172a"}`,borderRadius:12,padding:"10px 12px",cursor:eligible?"pointer":"not-allowed",opacity:eligible?1:0.35,transition:"border-color 0.12s"}}
                      onMouseEnter={e=>{if(eligible)e.currentTarget.style.borderColor=accent;}}
                      onMouseLeave={e=>{e.currentTarget.style.borderColor=eligible?"#1e293b":"#0f172a";}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                        <div>
                          <div style={{fontWeight:800,fontSize:14}}>{p.name}</div>
                          <div style={{fontSize:11,color:"#64748b",marginTop:1}}>{p.pos} · {p.side==="offense"?"⚡ Offense":"🛡️ Defense"}</div>
                        </div>
                        <div style={{display:"flex",gap:6,alignItems:"center"}}>
                          <TierBadge tier={p.tier}/>
                          <button onClick={()=>eligible&&playerDraftPick(p)}
                            style={{background:eligible?accent:"#334155",color:"#fff",border:"none",borderRadius:7,padding:"5px 14px",fontWeight:700,fontSize:12,cursor:eligible?"pointer":"default",opacity:eligible?1:0.5}}>
                            Pick ✓
                          </button>
                        </div>
                      </div>
                      {p.side==="offense"?(
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"3px 8px"}}>
                          {[["PRI",p.primary,"#60a5fa"],["SEC",p.secondary,"#E63946"],["SPD",p.speed,"#E9C46A"],["AWR",p.awareness,"#2A9D8F"]].map(([l,v,c])=>(
                            <div key={l}><div style={{display:"flex",justifyContent:"space-between",marginBottom:1}}><span style={{fontSize:8,color:"#64748b"}}>{l}</span><span style={{fontSize:8,color:"#94a3b8",fontWeight:700}}>{v}</span></div><StatBar value={v} color={c}/></div>
                          ))}
                        </div>
                      ):(
                        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:"3px 8px"}}>
                          {[["RUSH",p.pass_rush,"#E63946"],["COV",p.coverage,"#60a5fa"],["TCK",p.tackle,"#34d399"],["INS",p.instinct,"#f59e0b"]].map(([l,v,c])=>(
                            <div key={l}><div style={{display:"flex",justifyContent:"space-between",marginBottom:1}}><span style={{fontSize:8,color:"#64748b"}}>{l}</span><span style={{fontSize:8,color:"#94a3b8",fontWeight:700}}>{v}</span></div><StatBar value={v} color={c}/></div>
                          ))}
                        </div>
                      )}
                      {!eligible&&<div style={{fontSize:10,color:"#f87171",marginTop:6}}>{offFull?(g._gauntletDraft?"All picks used — complete your draft":"Offense side full"):"Defense side full"} — pick the other side</div>}
                    </div>
                  );
                })}
              </div>
            </div>
          ):(
            <div style={{textAlign:"center",color:"#64748b",padding:"24px 0",fontSize:13}}>⏳ AI is selecting…</div>
          )}
        </div>
      </div>
    );
  }

  // ── COIN TOSS ─────────────────────────────────────────────────────────────
  if(g.phase==="coin_toss") {
    // Online: home team flips, away waits
    const homeChooses = !isOnline || onlineSide==="home";
    const awayWaits = isOnline && onlineSide==="away";
    return (
      <div style={root}>
        <div style={{...card,maxWidth:380,margin:"16px auto 0",textAlign:"center"}}>
          <div style={{fontSize:48,marginBottom:8}}>🪙</div>
          <div style={{fontWeight:900,fontSize:18,marginBottom:4}}>Coin Toss</div>
          {awayWaits ? (
            <>
              <div style={{fontSize:13,color:"#64748b",marginBottom:16}}>
                Waiting for <span style={{color:g.teamColors.home?.primary,fontWeight:700}}>{g.teams.home}</span> to flip the coin…
              </div>
              <div style={{fontSize:32,animation:"spin 2s linear infinite"}}>🪙</div>
            </>
          ) : (
            <>
              <div style={{fontSize:13,color:"#64748b",marginBottom:6}}>
                {isOnline?`${g.teams.home} won the toss — choose:`:"You won the toss — choose:"}
              </div>
              {/* Both teams shown as reminder */}
              {isOnline&&(
                <div style={{display:"flex",gap:10,marginBottom:14}}>
                  {["away","home"].map(s=>(
                    <div key={s} style={{flex:1,background:"#0f172a",border:`2px solid ${g.teamColors[s]?.primary}`,borderRadius:10,padding:"8px"}}>
                      <TeamLogo teamName={g.teams[s]} primary={g.teamColors[s]?.primary} secondary={g.teamColors[s]?.secondary||"#fff"} size={36}/>
                      <div style={{fontSize:10,fontWeight:700,color:g.teamColors[s]?.primary,marginTop:4}}>{g.teams[s]}</div>
                      <div style={{fontSize:9,color:"#64748b"}}>{s==="away"?"Away":"Home"}</div>
                    </div>
                  ))}
                </div>
              )}
              <div style={{display:"flex",gap:10}}>
                <button style={{...btn(playerColor),flex:1}} onClick={()=>{
                  const opp=g.playerSide==="away"?"home":"away";
                  setG(prev=>{ const ns={...prev,...kickoff(opp),teams:prev.teams,teamColors:prev.teamColors}; if(prev.mode==="online") pushOnlineState(ns); return ns; });
                }}>🏈 Receive</button>
                <button style={{flex:1,background:"#1e293b",border:"1px solid #334155",color:"#94a3b8",borderRadius:10,padding:"12px 20px",fontWeight:800,fontSize:14,cursor:"pointer"}} onClick={()=>{
                  setG(prev=>{ const ns={...prev,...kickoff(prev.playerSide),teams:prev.teams,teamColors:prev.teamColors}; if(prev.mode==="online") pushOnlineState(ns); return ns; });
                }}>🦵 Kick</button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  // ── ROLLING ───────────────────────────────────────────────────────────────
  if(g.phase==="rolling") return <RollingScreen g={g} onReveal={resolvePlayResult} roomCode={isOnline?roomCode:null}/>;

  // ── PLAY CALL: OFFENSE ────────────────────────────────────────────────────
  if(g.phase==="play_call_offense") {
    const offColor=g.teamColors[g.possession]?.primary||playerColor;
    // In online: only show controls when it's your turn AND you have the ball
    const showControls = isOnline ? showOffenseControls : playerHasBall;
    const qb = (isOnline || g.possession===playerSide) ? g.playerRoster.starters.find(p=>p.pos==="QB") : g.aiRoster.starters.find(p=>p.pos==="QB");
    const rb = (isOnline || g.possession===playerSide ? g.playerRoster : g.aiRoster).starters.filter(p=>p.pos==="RB")[0];

    const guessBtn=(p,selected)=>({background:selected?p.color+"33":"#0f172a",border:`2px solid ${selected?p.color:"#1e293b"}`,color:selected?p.color:"#475569",borderRadius:8,padding:"7px 6px",fontWeight:700,fontSize:11,cursor:"pointer",flex:1,textAlign:"center",transition:"all 0.12s"});

    return (
      <div style={root}>
        {GauntletHUD}
        <Scoreboard g={g} roomCode={isOnline?roomCode:null} onSoundToggle={soundOn?{on:true,fn:()=>{_soundEnabled=false;setSoundOn(false);}}:{on:false,fn:()=>{_soundEnabled=true;setSoundOn(true);}}}/>

        {/* Last play + game log — above the card so field/down is always visible */}
        {g.lastResult&&g.lastDice&&(()=>{
          const lastOff=OFFENSE_PLAYS.find(p=>p.id===g.offensePlay);
          const lastDef=DEFENSE_PLAYS.find(p=>p.id===g.defensePlay);
          const dice=g.lastDice;
          const netColor=dice.net>0?"#34d399":dice.net<0?"#f87171":"#94a3b8";
          return(
            <div style={{width:"100%",maxWidth:580,padding:"4px 10px 0",boxSizing:"border-box"}}>
              <div style={{background:"#0a1020",border:"1px solid #1e293b",borderRadius:8,padding:"6px 10px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <div style={{display:"flex",gap:5,alignItems:"center",flexWrap:"wrap"}}>
                  {lastOff&&<span style={{fontSize:12}}>{lastOff.icon}<span style={{fontWeight:700,color:"#f8fafc",fontSize:11,marginLeft:3}}>{lastOff.label}</span></span>}
                  <span style={{fontSize:10,color:"#475569"}}>vs</span>
                  {lastDef&&<span style={{fontSize:12}}>{lastDef.icon}<span style={{color:"#64748b",fontSize:11,marginLeft:3}}>{lastDef.label}</span></span>}
                  <span style={{fontWeight:900,fontSize:12,color:netColor,marginLeft:4}}>({dice.net>0?`+${dice.net}`:dice.net})</span>
                </div>
                <span style={{fontSize:11,fontWeight:700,color:
                  g.lastResult.includes("TOUCHDOWN")?"#f59e0b":
                  g.lastResult.includes("TURNOVER")||g.lastResult.includes("INTERCEPTION")||g.lastResult.includes("FUMBLE")?"#f87171":
                  g.lastResult.includes("FIRST")?"#34d399":"#94a3b8",
                  flexShrink:0,marginLeft:8}}>{g.lastResult.replace(/[🏈📉✅🚀]/g,"").trim()}</span>
              </div>
            </div>
          );
        })()}

        <div style={card}>
          {/* Gauntlet roster toggle */}
          {isGauntlet&&(
            <div style={{marginBottom:6}}>
              <button onClick={()=>setShowGauntletRoster(s=>!s)}
                style={{background:"#0f172a",border:`1px solid ${showGauntletRoster?playerColor:"#1e293b"}`,color:showGauntletRoster?playerColor:"#475569",borderRadius:8,padding:"5px 12px",fontSize:11,fontWeight:700,cursor:"pointer",width:"100%"}}>
                {showGauntletRoster?"▲ Hide Roster":"📋 View My Roster"}
              </button>
              {showGauntletRoster&&<RosterPanel roster={g.playerRoster} color={playerColor} onClose={()=>setShowGauntletRoster(false)}/>}
            </div>
          )}

          {showControls ? (
            <>
              {/* Shot clock */}
              {isOnline&&shotClock!==null&&(
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"#0a0f1a",border:`1px solid ${shotClock<=3?"#f87171":"#1e293b"}`,borderRadius:7,padding:"4px 10px",marginBottom:8}}>
                  <div style={{fontSize:11,color:"#64748b"}}>Play clock</div>
                  <ShotClock seconds={shotClock} color={offColor}/>
                </div>
              )}

              {/* QB/RB slim bar */}
              {qb&&(
                <div style={{display:"flex",gap:6,marginBottom:8}}>
                  <div style={{flex:1,background:"#0f172a",borderRadius:7,padding:"5px 8px",borderLeft:`2px solid ${offColor}`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:11,fontWeight:700,color:"#f8fafc"}}>{qb.name}</span>
                    <span style={{fontSize:9,color:"#64748b"}}>ARM {qb.primary} · ACC {qb.secondary}</span>
                  </div>
                  {rb&&<div style={{flex:1,background:"#0f172a",borderRadius:7,padding:"5px 8px",borderLeft:`2px solid #f59e0b`,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <span style={{fontSize:11,fontWeight:700,color:"#f8fafc"}}>{rb.name}</span>
                    <span style={{fontSize:9,color:"#64748b"}}>PWR {rb.primary} · SPD {rb.speed}</span>
                  </div>}
                </div>
              )}

              {/* Read the defense guess — compact row */}
              <div style={{marginBottom:8}}>
                <div style={{fontSize:9,color:"#475569",textTransform:"uppercase",letterSpacing:1,marginBottom:4}}>🔍 Guess Defense <span style={{color:"#34d399"}}>+bonus</span> if right · <span style={{color:"#f87171"}}>-penalty</span> if wrong</div>
                <div style={{display:"flex",gap:4}}>
                  {DEFENSE_PLAYS.map(p=>{
                    const col=p.id==="blitz"?"#E63946":p.id==="zone"?"#60a5fa":p.id==="man"?"#34d399":p.id==="cover2"?"#9B5DE5":"#f59e0b";
                    const sel=g.playGuess===p.id;
                    return(
                      <button key={p.id} onClick={()=>setG(prev=>({...prev,playGuess:prev.playGuess===p.id?null:p.id}))}
                        style={{flex:1,background:sel?col+"33":"#0f172a",border:`1.5px solid ${sel?col:"#1e293b"}`,color:sel?col:"#475569",borderRadius:6,padding:"5px 2px",fontWeight:700,fontSize:10,cursor:"pointer",textAlign:"center"}}>
                        {p.icon}<div style={{fontSize:8,marginTop:1}}>{p.label.split(" ")[0]}</div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Play buttons — compact 2-column grid */}
              <div style={{fontSize:9,color:"#475569",textTransform:"uppercase",letterSpacing:1,marginBottom:5}}>📣 Call a Play</div>
              <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:5}}>
                {OFFENSE_PLAYS.map(play=>(
                  <button key={play.id} onClick={()=>choosePitch(play.id)}
                    style={{background:"#0f172a",border:`1.5px solid #253046`,borderRadius:8,padding:"7px 8px",cursor:"pointer",display:"flex",alignItems:"center",gap:6,textAlign:"left",transition:"border-color 0.1s"}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor=offColor}
                    onMouseLeave={e=>e.currentTarget.style.borderColor="#253046"}>
                    <span style={{fontSize:18,flexShrink:0}}>{play.icon}</span>
                    <div>
                      <div style={{fontWeight:800,fontSize:12,color:"#f8fafc"}}>{play.label}</div>
                      <div style={{fontSize:9,color:"#64748b",marginTop:1}}>{play.desc}</div>
                    </div>
                  </button>
                ))}
                {/* Punt — 4th down only */}
                {g.down===4&&(
                  <button onClick={()=>choosePitch("punt")}
                    style={{background:"#0f172a",border:"1.5px solid #334155",borderRadius:8,padding:"7px 8px",cursor:"pointer",display:"flex",alignItems:"center",gap:6}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor="#94a3b8"}
                    onMouseLeave={e=>e.currentTarget.style.borderColor="#334155"}>
                    <span style={{fontSize:18}}>👢</span>
                    <div>
                      <div style={{fontWeight:800,fontSize:12,color:"#94a3b8"}}>Punt</div>
                      <div style={{fontSize:9,color:"#475569"}}>Kick it away</div>
                    </div>
                  </button>
                )}
                {/* FG — in range */}
                {yardsToTD(g.fieldPosition)<=45&&(
                  <button onClick={()=>choosePitch("field_goal")}
                    style={{background:"#1a0e00",border:"1.5px solid #92400e",borderRadius:8,padding:"7px 8px",cursor:"pointer",display:"flex",alignItems:"center",gap:6}}
                    onMouseEnter={e=>e.currentTarget.style.borderColor="#f59e0b"}
                    onMouseLeave={e=>e.currentTarget.style.borderColor="#92400e"}>
                    <span style={{fontSize:18}}>⚡</span>
                    <div>
                      <div style={{fontWeight:800,fontSize:12,color:"#f59e0b"}}>Field Goal</div>
                      <div style={{fontSize:9,color:"#92400e"}}>{yardsToTD(g.fieldPosition)+17} yd attempt</div>
                    </div>
                  </button>
                )}
              </div>

              {/* Game log — compact */}
              <div style={{background:"#0f172a",borderRadius:7,padding:"6px 8px",marginTop:8,maxHeight:52,overflowY:"auto"}} ref={logRef}>
                {g.gameLog.slice(-3).map((l,i)=><div key={i} style={{fontSize:10,color:l.startsWith("---")?"#3b82f6":l.includes("TOUCHDOWN")?"#f59e0b":l.includes("TURNOVER")||l.includes("Turnover")?"#f87171":"#64748b",marginBottom:1}}>{l}</div>)}
              </div>
            </>
          ):(
            <div style={{color:"#64748b",textAlign:"center",padding:"16px 0"}}>
              {isOnline ? `⏳ Waiting for ${g.teams[g.possession]} to call a play…` : "🤖 AI offense is huddling…"}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── PLAY CALL: DEFENSE ────────────────────────────────────────────────────
  if(g.phase==="play_call_defense") {
    const defSide=g.possession==="away"?"home":"away";
    const defColor=g.teamColors[defSide]?.primary||"#3b82f6";
    // In online: defensive player is the one whose side !== possession
    const showControls = isGauntlet ? false : isOnline ? showDefenseControls : playerOnDef;
    const defRoster = isOnline ? g.playerRoster : (defSide===playerSide?g.playerRoster:g.aiRoster);
    const topLB=defRoster.starters.filter(p=>p.pos==="LB").sort((a,b)=>b.pass_rush-a.pass_rush)[0];
    const topCB=defRoster.starters.filter(p=>p.pos==="CB").sort((a,b)=>b.coverage-a.coverage)[0];
    const offPlayDef=OFFENSE_PLAYS.find(p=>p.id===g.offensePlay);
    return (
      <div style={root}>
        <Scoreboard g={g} roomCode={isOnline?roomCode:null} onSoundToggle={soundOn?{on:true,fn:()=>{_soundEnabled=false;setSoundOn(false);}}:{on:false,fn:()=>{_soundEnabled=true;setSoundOn(true);}}}/>
        <div style={card}>

          {/* Key defenders */}
          {(topLB||topCB)&&(
            <div style={{display:"flex",gap:8,marginBottom:10}}>
              {topLB&&<div style={{flex:1,background:"#0f172a",borderRadius:8,padding:"8px 10px",borderLeft:`3px solid ${defColor}`}}>
                <div style={{fontSize:9,color:"#64748b",marginBottom:2,textTransform:"uppercase"}}>Linebacker</div>
                <div style={{fontSize:12,fontWeight:700}}>{topLB.name}</div>
                <div style={{fontSize:9,color:"#94a3b8"}}>LB · BLITZ {topLB.pass_rush} · COV {topLB.coverage}</div>
              </div>}
              {topCB&&<div style={{flex:1,background:"#0f172a",borderRadius:8,padding:"8px 10px",borderLeft:`3px solid #9b5de5`}}>
                <div style={{fontSize:9,color:"#64748b",marginBottom:2,textTransform:"uppercase"}}>Corner</div>
                <div style={{fontSize:12,fontWeight:700}}>{topCB.name}</div>
                <div style={{fontSize:9,color:"#94a3b8"}}>CB · PRESS {topCB.pass_rush} · COV {topCB.coverage}</div>
              </div>}
            </div>
          )}
          {showControls ? (
            <>
              {isOnline&&shotClock!==null&&(
                <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",background:"#0a0f1a",border:`1px solid ${shotClock<=3?"#f87171":"#1e293b"}`,borderRadius:8,padding:"6px 12px",marginBottom:10}}>
                  <div style={{fontSize:12,color:"#64748b"}}>Play clock — pick a scheme or it auto-selects!</div>
                  <ShotClock seconds={shotClock} color={defColor}/>
                </div>
              )}
              <div style={lbl}>🛡️ {g.teams[defSide]} — Choose Your Defense</div>
              <div style={{display:"flex",flexDirection:"column",gap:8}}>
                {DEFENSE_PLAYS.map(play=>{
                  const isStrong=false;
                  const isWeak=false;
                  return (
                    <button key={play.id} onClick={()=>chooseDefensePlay(play.id)}
                      style={{...offBtn(defColor,false),display:"flex",justifyContent:"space-between",alignItems:"center",borderColor:isStrong?"#34d399":isWeak?"#f87171":"#253046",padding:"10px 12px"}}>
                      <span style={{fontSize:16,marginRight:6}}>{play.icon}</span>
                      <span style={{flex:1,textAlign:"left",fontWeight:800}}>{play.label}</span>
                      <div style={{textAlign:"right"}}>
                        <div style={{fontSize:11,color:"#64748b"}}>{play.desc}</div>
                        {isStrong&&<div style={{fontSize:9,color:"#34d399",fontWeight:700}}>🛡️ Strong vs this</div>}
                        {isWeak&&<div style={{fontSize:9,color:"#f87171",fontWeight:700}}>⚡ Weak vs this</div>}
                      </div>
                    </button>
                  );
                })}
              </div>
            </>
          ):(
            <div style={{color:"#64748b",textAlign:"center",padding:"16px 0"}}>
              {isOnline ? `⏳ Waiting for ${g.teams[defSide]} to call their defense…` : "🤖 Defense is reading the offense…"}
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── RESULT ────────────────────────────────────────────────────────────────
  if(g.phase==="result") {
    const dice=g.lastDice;
    const offColor=g.teamColors[g.possession]?.primary||"#E63946";
    const defColor=g.teamColors[g.possession==="away"?"home":"away"]?.primary||"#3b82f6";
    const isTD=dice?.special==="touchdown";
    const isTurnover=dice?.special==="fumble"||dice?.special==="interception";
    const isSack=dice?.special==="sack";
    const offPlayDef=OFFENSE_PLAYS.find(p=>p.id===g.offensePlay);
    const defPlayDef=DEFENSE_PLAYS.find(p=>p.id===g.defensePlay);

    return (
      <div style={root}>
        <Scoreboard g={g} roomCode={isOnline?roomCode:null} onSoundToggle={soundOn?{on:true,fn:()=>{_soundEnabled=false;setSoundOn(false);}}:{on:false,fn:()=>{_soundEnabled=true;setSoundOn(true);}}}/>
        <div style={card}>
          {/* Result banner */}
          <div style={{background:isTD?"linear-gradient(135deg,#7c3aed,#e63946)":isTurnover?"linear-gradient(135deg,#7f1d1d,#111827)":isSack?"linear-gradient(135deg,#1e1a2e,#111827)":"linear-gradient(135deg,#1e293b,#141d2e)",border:`2px solid ${isTD?"#e63946":isTurnover?"#f87171":isSack?"#9b5de5":"#253046"}`,borderRadius:12,padding:"10px 14px",textAlign:"center",marginBottom:10}}>
            <div style={{fontSize:22,fontWeight:900}}>{dice?.yardLabel||g.lastResult}</div>
            {dice?.schemeLabel&&<div style={{fontSize:12,color:"#f59e0b",marginTop:4}}>{dice.schemeLabel}</div>}
          </div>
          {/* Dice recap */}
          {dice&&(
            <div style={{background:"#0f172a",border:"1px solid #1e293b",borderRadius:10,padding:12,marginBottom:10}}>
              <div style={{display:"grid",gridTemplateColumns:"1fr auto 1fr",alignItems:"center",gap:8,marginBottom:8}}>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:9,color:offColor,textTransform:"uppercase",letterSpacing:1,marginBottom:4,fontWeight:700}}>Offense</div>
                  <div style={{display:"flex",justifyContent:"center"}}><DiceFace value={dice.offRoll} color={offColor} bg="#0f172a" size={44}/></div>
                  <div style={{fontSize:9,color:"#475569",marginTop:3}}>{dice.offStatName} {dice.adjustedOffStat??dice.offStat}</div>
                </div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:9,color:"#f59e0b",textTransform:"uppercase",letterSpacing:1,marginBottom:4,fontWeight:700}}>Luck</div>
                  <div style={{width:38,height:38,borderRadius:8,border:"2px solid #f59e0b",background:"#1a1200",display:"flex",alignItems:"center",justifyContent:"center",margin:"0 auto"}}>
                    <span style={{fontSize:16,fontWeight:900,color:dice.luckMod>0?"#34d399":dice.luckMod<0?"#f87171":"#94a3b8"}}>{dice.luckMod>0?"+1":dice.luckMod<0?"-1":"0"}</span>
                  </div>
                </div>
                <div style={{textAlign:"center"}}>
                  <div style={{fontSize:9,color:defColor,textTransform:"uppercase",letterSpacing:1,marginBottom:4,fontWeight:700}}>Defense</div>
                  <div style={{display:"flex",justifyContent:"center"}}><DiceFace value={dice.defRoll} color={defColor} bg="#0f172a" size={44}/></div>
                  <div style={{fontSize:9,color:"#475569",marginTop:3}}>{dice.defStatName} {dice.defStat}</div>
                </div>
              </div>
              <div style={{borderTop:"1px solid #1e293b",paddingTop:8,textAlign:"center",fontFamily:"monospace",fontSize:12,color:"#64748b"}}>
                <span style={{color:offColor,fontWeight:700}}>{dice.offRoll}</span>
                <span style={{color:"#475569"}}> − </span>
                <span style={{color:defColor,fontWeight:700}}>{dice.defRoll}</span>
                <span style={{color:dice.luckMod>0?"#34d399":dice.luckMod<0?"#f87171":"#475569",fontWeight:700}}> {dice.luckMod>=0?"+ ":"− "}{Math.abs(dice.luckMod)}</span>
                {dice.schemeBonus!==0&&<span style={{color:dice.schemeBonus>0?"#34d399":"#f87171",fontWeight:700}}> {dice.schemeBonus>0?"+ ":"− "}{Math.abs(dice.schemeBonus)}</span>}
                <span style={{color:"#475569"}}> = </span>
                <span style={{color:dice.net>0?"#34d399":dice.net<0?"#f87171":"#94a3b8",fontWeight:900,fontSize:15}}>{dice.net>0?`+${dice.net}`:dice.net}</span>
              </div>
              {dice.guessCorrect&&<div style={{marginTop:6,textAlign:"center",fontSize:11,color:"#34d399",fontWeight:700}}>✅ Right read on the defense — bonus!</div>}
              {dice.guessWrong&&<div style={{marginTop:6,textAlign:"center",fontSize:11,color:"#f87171",fontWeight:700}}>❌ Wrong read — you got fooled.</div>}
            </div>
          )}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,marginBottom:10}}>
            <div style={{background:"#1e293b",borderRadius:8,padding:"8px 12px"}}><div style={{...lbl,marginBottom:2}}>Offense</div><div style={{fontWeight:700,fontSize:13}}>{offPlayDef?.icon} {offPlayDef?.label}</div></div>
            <div style={{background:"#1e293b",borderRadius:8,padding:"8px 12px"}}><div style={{...lbl,marginBottom:2}}>Defense</div><div style={{fontWeight:700,fontSize:13}}>{defPlayDef?.icon} {defPlayDef?.label}</div></div>
          </div>
          {/* Situation report */}
          {g.down>0&&!isTD&&!isTurnover&&(
            <div style={{background:"#0f172a",borderRadius:8,padding:"8px 12px",marginBottom:10,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <div style={{fontSize:13,fontWeight:700,color:g.teamColors[g.possession]?.primary}}>{g.down}{g.down===1?"st":g.down===2?"nd":g.down===3?"rd":"th"} & {g.yardsToGo}</div>
              <div style={{fontSize:12,color:"#64748b"}}>{g.fieldPosition>50?`Opp ${100-g.fieldPosition}`:`Own ${g.fieldPosition}`}</div>
            </div>
          )}
          {/* Log */}
          <div style={{background:"#0f172a",borderRadius:8,padding:"8px 10px",marginBottom:10,maxHeight:70,overflowY:"auto"}} ref={logRef}>
            {g.gameLog.slice(-5).map((l,i)=><div key={i} style={{fontSize:11,color:l.startsWith("---")?"#3b82f6":l.includes("TOUCHDOWN")?"#f59e0b":l.includes("TURNOVER")||l.includes("Turnover")?"#f87171":"#94a3b8",marginBottom:2}}>{l}</div>)}
          </div>
          {/* Next play button — in online mode only the possession side advances */}
          {isOnline && g._turn !== onlineSide ? (
            <div style={{color:"#64748b",textAlign:"center",padding:"10px 0",fontSize:13}}>
              ⏳ Waiting for {g.teams[g.possession]} to continue…
            </div>
          ) : (
            <button style={btn(playerColor)} onClick={()=>setG(prev=>{
              const next=nextPlayState(prev);
              if(prev.mode==="online") pushOnlineState(next);
              return next;
            })}>
              Next Play ▶{g.mode==="vs-ai"?" (or wait 5s)":""}
            </button>
          )}
        </div>
      </div>
    );
  }

  // ── HALFTIME ──────────────────────────────────────────────────────────────
  if(g.phase==="halftime") {
    return (
      <div style={root}>
        <div style={{...card,maxWidth:400,margin:"16px auto 0",textAlign:"center"}}>
          <div style={{fontSize:32,marginBottom:8}}>🏟️</div>
          <div style={{fontWeight:900,fontSize:20,marginBottom:4}}>Halftime</div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:12}}>
            {["away","home"].map(s=>(
              <div key={s} style={{background:"#1e293b",borderRadius:10,padding:12,border:`2px solid ${g.teamColors[s].primary}`}}>
                <div style={{fontSize:9,color:"#64748b",textTransform:"uppercase",letterSpacing:1.5}}>{g.teams[s]}</div>
                <div style={{fontSize:32,fontWeight:900,color:g.teamColors[s].primary}}>{g.score[s]}</div>
              </div>
            ))}
          </div>
          <div style={{fontSize:12,color:"#64748b",marginBottom:12}}>Second half kickoff — the receiving team flips!</div>
          <button style={btn(playerColor)} onClick={()=>{
            // Second half: other team kicks off
            const newReceiver=g.possession; // whoever had ball last gets to receive
            setG(prev=>({...prev,...kickoff(prev.possession==="away"?"home":"away"),score:prev.score,gameLog:[...prev.gameLog,"--- Q3 ---"]}));
          }}>Start 2nd Half →</button>
        </div>
      </div>
    );
  }

  // ── ONLINE LOBBY ──────────────────────────────────────────────────────────
  if(g.phase==="online_lobby") {
    const sel={width:"100%",background:"#0f172a",border:"1px solid #334155",color:"#f8fafc",borderRadius:8,padding:"8px 12px",fontSize:14,fontWeight:700,appearance:"none",cursor:"pointer",outline:"none"};
    const ColorSwatch=({idx,selected,onClick})=>(
      <div onClick={onClick} style={{width:26,height:26,borderRadius:"50%",background:TEAM_PALETTE[idx].primary,border:selected?"3px solid #f8fafc":"3px solid transparent",cursor:"pointer",flexShrink:0,boxShadow:selected?`0 0 0 2px ${TEAM_PALETTE[idx].primary}`:""}}/>
    );
    return (
      <div style={root}>
        <div style={{...card,maxWidth:420,margin:"16px auto 0",textAlign:"center"}}>
          <div style={{fontSize:32,marginBottom:8}}>🌐</div>
          <div style={{fontWeight:900,fontSize:18,marginBottom:14}}>Play Online</div>
          {onlineState==="idle"&&(
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              <div style={{textAlign:"left"}}>
                <div style={lbl}>Your Team</div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:6}}>
                  <div style={{fontSize:18,fontWeight:900,color:TEAM_PALETTE[playerColorIdx].primary,flex:1}}>{teamName}</div>
                  <button onClick={()=>setShowTeamDrop(s=>!s)} style={{background:"#1e293b",border:"1px solid #334155",color:"#64748b",borderRadius:6,padding:"4px 10px",cursor:"pointer",fontSize:16,lineHeight:1}}>{showTeamDrop?"▲":"▾"}</button>
                </div>
                {showTeamDrop&&(
                  <select autoFocus style={{...sel,marginBottom:6}} value={teamName} onChange={e=>{setTeamName(e.target.value);setShowTeamDrop(false);}}>
                    {TEAM_NAMES.map(n=><option key={n} value={n} style={{background:"#1e293b"}}>{n}</option>)}
                  </select>
                )}
              </div>
              <div style={{textAlign:"left"}}>
                <div style={lbl}>Team Color</div>
                <div style={{display:"flex",gap:6,flexWrap:"wrap"}}>
                  {TEAM_PALETTE.map((_,i)=><ColorSwatch key={i} idx={i} selected={playerColorIdx===i} onClick={()=>setPlayerColorIdx(i)}/>)}
                </div>
              </div>
              <div style={{textAlign:"left"}}>
                <div style={lbl}>Minutes Per Quarter</div>
                <div style={{display:"flex",gap:6}}>
                  {[3,5,10,15].map(n=>(
                    <button key={n} onClick={()=>setMinutesPerQuarter(n)}
                      style={{flex:1,background:minutesPerQuarter===n?"#E63946":"#1e293b",border:`2px solid ${minutesPerQuarter===n?"#E63946":"#334155"}`,color:"#fff",borderRadius:6,padding:"6px 0",fontWeight:700,fontSize:13,cursor:"pointer"}}>
                      {n}m
                    </button>
                  ))}
                </div>
              </div>
              <div style={{textAlign:"left"}}>
                <div style={lbl}>Draft</div>
                <div style={{display:"flex",gap:8}}>
                  <button onClick={()=>setSkipDraft(false)}
                    style={{flex:1,background:!skipDraft?"#E63946":"#1e293b",border:`2px solid ${!skipDraft?"#E63946":"#334155"}`,color:"#fff",borderRadius:6,padding:"8px 0",fontWeight:700,fontSize:13,cursor:"pointer"}}>
                    ✅ Yes
                    <div style={{fontSize:9,fontWeight:400,color:!skipDraft?"#fca5a5":"#64748b",marginTop:1}}>Pick roster</div>
                  </button>
                  <button onClick={()=>setSkipDraft(true)}
                    style={{flex:1,background:skipDraft?"#E63946":"#1e293b",border:`2px solid ${skipDraft?"#E63946":"#334155"}`,color:"#fff",borderRadius:6,padding:"8px 0",fontWeight:700,fontSize:13,cursor:"pointer"}}>
                    🎲 No
                    <div style={{fontSize:9,fontWeight:400,color:skipDraft?"#fca5a5":"#64748b",marginTop:1}}>Random teams</div>
                  </button>
                </div>
              </div>
              <button style={btn("#E63946")} onClick={async()=>{
                const code=generateRoomCode(); setRoomCode(code); setOnlineSide("away"); setOnlineState("show_code");
                await supa.upsertRoom(code,{status:"waiting",minsPerQ:minutesPerQuarter,skipDraft,awayName:teamName,awayColorIdx:playerColorIdx});
              }}>🏠 Create Room</button>
              <div style={{fontSize:13,color:"#475569"}}>— or join —</div>
              <div style={{display:"flex",gap:8}}>
                <input value={roomInput} onChange={e=>setRoomInput(e.target.value.toUpperCase())} placeholder="Room code" maxLength={5}
                  style={{flex:1,background:"#0f172a",border:"1px solid #334155",color:"#f8fafc",borderRadius:8,padding:"10px 12px",fontSize:16,fontWeight:800,textAlign:"center",letterSpacing:4,outline:"none"}}/>
                <button style={{...btn("#3b82f6"),width:"auto",padding:"10px 16px"}} onClick={async()=>{
                  if(roomInput.length<3){setOnlineError("Enter a valid code");return;}
                  const row=await supa.getRoom(roomInput);
                  if(!row){setOnlineError("Room not found");return;}
                  setRoomCode(roomInput); setOnlineSide("home"); setOnlineState("playing");
                  const roomSkipDraft = row.skipDraft || false;
                  if(roomSkipDraft) {
                    const pool=buildDraftPool();
                    const playerRoster=buildAIRoster(pool,[]);
                    const takenIds=playerRoster.starters.map(p=>p.id);
                    const aiRoster=buildAIRoster(pool,takenIds);
                    setG({...initGame(),mode:"online",phase:"coin_toss",_playoffDraft:false,playerSide:"home",_turn:"home",playerRoster,aiRoster,teams:{away:row.awayName||"Away",home:teamName},teamColors:{away:TEAM_PALETTE[row.awayColorIdx||0],home:TEAM_PALETTE[playerColorIdx]},_clockPerQuarter:(row.minsPerQ||5)*60,gameClock:(row.minsPerQ||5)*60,gameLog:[`🏈 ${row.awayName||"Away"} vs ${teamName} (Random Teams)`]});
                  } else {
                    const pool=buildDraftPool();
                    const firstOptions=buildDraftOptions(pool,[],true,true,{S:0,A:0,B:0,C:0},3);
                    setG({...initGame(),mode:"online",phase:"draft",_playoffDraft:true,playerSide:"home",_turn:"home",draftPool:pool,draftPick:0,draftOptions:firstOptions,playerRoster:{starters:[],bench:[]},aiRoster:{starters:[],bench:[]},teams:{away:row.awayName||"Away",home:teamName},teamColors:{away:TEAM_PALETTE[row.awayColorIdx||0],home:TEAM_PALETTE[playerColorIdx]},_clockPerQuarter:(row.minsPerQ||5)*60,gameClock:(row.minsPerQ||5)*60});
                  }
                }}>Join</button>
              </div>
              {onlineError&&<div style={{fontSize:12,color:"#f87171"}}>{onlineError}</div>}
            </div>
          )}
          {onlineState==="show_code"&&(
            <div>
              <div style={{fontSize:13,color:"#64748b",marginBottom:6}}>Share this code, then {skipDraft?"start playing":"start your draft"}:</div>
              <div style={{background:"#0f172a",borderRadius:12,padding:"10px",fontSize:36,fontWeight:900,letterSpacing:8,color:"#f59e0b",marginBottom:12,fontFamily:"monospace"}}>{roomCode}</div>
              <button style={btn("#E63946")} onClick={()=>{
                setOnlineState("playing");
                if(skipDraft) {
                  const pool=buildDraftPool();
                  const playerRoster=buildAIRoster(pool,[]);
                  const takenIds=playerRoster.starters.map(p=>p.id);
                  const aiRoster=buildAIRoster(pool,takenIds);
                  setG({...initGame(),mode:"online",phase:"coin_toss",_playoffDraft:false,playerSide:"away",_turn:"home",playerRoster,aiRoster,teams:{away:teamName,home:"Opponent"},teamColors:{away:TEAM_PALETTE[playerColorIdx],home:TEAM_PALETTE[(playerColorIdx+3)%10]},_clockPerQuarter:minutesPerQuarter*60,gameClock:minutesPerQuarter*60,gameLog:[`🏈 ${teamName} vs Opponent (Random Teams)`]});
                } else {
                  const pool=buildDraftPool(); const firstOptions=buildDraftOptions(pool,[],true,true,{S:0,A:0,B:0,C:0},3);
                  setG({...initGame(),mode:"online",phase:"draft",_playoffDraft:true,playerSide:"away",_turn:"away",draftPool:pool,draftPick:0,draftOptions:firstOptions,playerRoster:{starters:[],bench:[]},aiRoster:{starters:[],bench:[]},teams:{away:teamName,home:"Opponent"},teamColors:{away:TEAM_PALETTE[playerColorIdx],home:TEAM_PALETTE[(playerColorIdx+3)%10]},_clockPerQuarter:minutesPerQuarter*60,gameClock:minutesPerQuarter*60});
                }
              }}>{skipDraft?"Play Now 🎲":"Start My Draft →"}</button>
            </div>
          )}
          <button style={{...btn("#475569"),marginTop:12,fontSize:12}} onClick={()=>setG(prev=>({...prev,phase:"menu"}))}>← Back</button>
        </div>
      </div>
    );
  }

  // ── GAME OVER ─────────────────────────────────────────────────────────────
  if(g.phase==="gameover") {
    const winner=g.score.away>g.score.home?"away":g.score.home>g.score.away?"home":"tie";
    const winName=winner==="tie"?"Tie Game!":g.teams[winner];
    const winColor=winner==="tie"?"#f59e0b":g.teamColors[winner]?.primary;
    // Drive summary stats
    const totalPlays=g.gameLog.filter(l=>["Run","Short Pass","Deep Pass","Screen","Option"].some(p=>l.includes(p))).length;
    const tds=g.gameLog.filter(l=>l.includes("TOUCHDOWN")).length;
    const turnovers=g.gameLog.filter(l=>l.includes("TURNOVER")||l.includes("Turnover")).length;
    return (
      <div style={root}>
        <div style={{...card,maxWidth:460,margin:"12px auto 0",textAlign:"center"}}>
          <div style={{background:`linear-gradient(135deg,${winColor}33,#111827)`,borderRadius:12,padding:"18px 16px 14px",marginBottom:10}}>
            <div style={{fontSize:36,marginBottom:4}}>🏆</div>
            <div style={{fontSize:22,fontWeight:900,color:winColor,marginBottom:2}}>{winName}{winner!=="tie"?" Win!":" "}</div>
            <div style={{fontSize:13,color:"#94a3b8"}}>Final Score</div>
          </div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:14}}>
            {["away","home"].map(s=>(
              <div key={s} style={{background:"#1e293b",borderRadius:10,padding:12,border:`2px solid ${g.teamColors[s].primary}`}}>
                <div style={{fontSize:9,color:"#64748b",textTransform:"uppercase",letterSpacing:1.5}}>{g.teams[s]}</div>
                <div style={{fontSize:36,fontWeight:900,color:g.teamColors[s].primary}}>{g.score[s]}</div>
              </div>
            ))}
          </div>
          {/* Game stats */}
          <div style={{background:"#111827",border:"1px solid #1e293b",borderRadius:10,padding:"10px 14px",marginBottom:10,textAlign:"left"}}>
            <div style={{fontSize:10,color:"#64748b",textTransform:"uppercase",letterSpacing:1,marginBottom:8}}>Final Stats</div>
            {[["Total Plays",totalPlays],["Touchdowns",tds],["Turnovers",turnovers]].map(([l,v])=>(
              <div key={l} style={{display:"flex",justifyContent:"space-between",marginBottom:4,fontSize:13}}>
                <span style={{color:"#64748b"}}>{l}</span>
                <span style={{fontWeight:700,color:"#f8fafc"}}>{v}</span>
              </div>
            ))}
          </div>
          {/* Game log */}
          <div style={{background:"#0f172a",borderRadius:8,padding:8,marginBottom:12,maxHeight:100,overflowY:"auto",textAlign:"left"}} ref={logRef}>
            {g.gameLog.map((l,i)=><div key={i} style={{fontSize:10,color:l.startsWith("---")?"#3b82f6":l.includes("TOUCHDOWN")?"#f59e0b":l.includes("TURNOVER")||l.includes("Turnover")?"#f87171":"#94a3b8",marginBottom:2}}>{l}</div>)}
          </div>
          <button style={btn("#E63946")} onClick={resetGame}>🔄 Play Again</button>
          <button style={{...btn("#475569"),marginTop:6,fontSize:12}} onClick={resetGame}>← Main Menu</button>
        </div>
      </div>
    );
  }

  // ── GAUNTLET: PLAYING — show objective HUD above normal screens ────────────────
  // In gauntlet mode, the normal play screens render but with an objective overlay

  return null;
}

export default GridironGame;
