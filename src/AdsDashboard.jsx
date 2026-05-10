import { useState, useMemo } from "react";

// ─── RAW DATA ────────────────────────────────────────────────────────────────
const RAW_DATA = [
  // ── META · KADO BAJO · FEB 2026
  { date:"2026-02-28", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Awareness", spend:137250, impressions:3499904, reach:2431180, clicks:22312, conversions:0, ctr:0.64, cpc:6, cpm:39, month:"Feb 2026" },

  // ── META · KADO BAJO · MAR 2026
  { date:"2026-03-01", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Awareness", spend:142297, impressions:5483271, reach:3659467, clicks:51876, conversions:0, ctr:0.95, cpc:3, cpm:26, month:"Mar 2026" },
  { date:"2026-03-01", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Awareness", spend:73639, impressions:2276136, reach:1469427, clicks:18939, conversions:0, ctr:0.83, cpc:4, cpm:32, month:"Mar 2026" },
  { date:"2026-03-02", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Awareness", spend:125940, impressions:3223553, reach:2421117, clicks:19641, conversions:0, ctr:0.61, cpc:6, cpm:39, month:"Mar 2026" },
  { date:"2026-03-02", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Awareness", spend:65411, impressions:1554757, reach:964260, clicks:14971, conversions:0, ctr:0.96, cpc:4, cpm:42, month:"Mar 2026" },
  { date:"2026-03-03", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Awareness", spend:105380, impressions:3053570, reach:2317623, clicks:25190, conversions:0, ctr:0.82, cpc:4, cpm:35, month:"Mar 2026" },
  { date:"2026-03-03", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Awareness", spend:65085, impressions:1960497, reach:1321445, clicks:20690, conversions:0, ctr:1.06, cpc:3, cpm:33, month:"Mar 2026" },
  { date:"2026-03-04", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Awareness", spend:115463, impressions:4247342, reach:2766292, clicks:38426, conversions:0, ctr:0.90, cpc:3, cpm:27, month:"Mar 2026" },
  { date:"2026-03-04", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Awareness", spend:63129, impressions:1635566, reach:1193320, clicks:23808, conversions:0, ctr:1.46, cpc:3, cpm:39, month:"Mar 2026" },
  { date:"2026-03-05", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Awareness", spend:145903, impressions:5684787, reach:3871885, clicks:38095, conversions:0, ctr:0.67, cpc:4, cpm:26, month:"Mar 2026" },
  { date:"2026-03-05", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Awareness", spend:74547, impressions:1849735, reach:1170291, clicks:24238, conversions:0, ctr:1.31, cpc:3, cpm:40, month:"Mar 2026" },
  { date:"2026-03-06", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Awareness", spend:153775, impressions:4879571, reach:3266108, clicks:26660, conversions:0, ctr:0.55, cpc:6, cpm:32, month:"Mar 2026" },
  { date:"2026-03-06", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Awareness", spend:67984, impressions:2322740, reach:1652373, clicks:28987, conversions:0, ctr:1.25, cpc:2, cpm:29, month:"Mar 2026" },
  { date:"2026-03-07", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Awareness", spend:148070, impressions:5489624, reach:4369446, clicks:49602, conversions:0, ctr:0.90, cpc:3, cpm:27, month:"Mar 2026" },
  { date:"2026-03-07", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Awareness", spend:76703, impressions:2492060, reach:1609396, clicks:33473, conversions:0, ctr:1.34, cpc:2, cpm:31, month:"Mar 2026" },
  { date:"2026-03-08", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Awareness", spend:131884, impressions:5863867, reach:4458932, clicks:40417, conversions:0, ctr:0.69, cpc:3, cpm:22, month:"Mar 2026" },
  { date:"2026-03-08", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Awareness", spend:58060, impressions:1536402, reach:986672, clicks:15170, conversions:0, ctr:0.99, cpc:4, cpm:38, month:"Mar 2026" },
  { date:"2026-03-09", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Awareness", spend:94038, impressions:3910861, reach:3216062, clicks:31649, conversions:0, ctr:0.81, cpc:3, cpm:24, month:"Mar 2026" },
  { date:"2026-03-09", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Awareness", spend:84083, impressions:2764041, reach:2020756, clicks:28200, conversions:0, ctr:1.02, cpc:3, cpm:30, month:"Mar 2026" },
  { date:"2026-03-10", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Awareness", spend:68447, impressions:2279909, reach:1488725, clicks:25562, conversions:0, ctr:1.12, cpc:3, cpm:30, month:"Mar 2026" },
  { date:"2026-03-11", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Awareness", spend:64189, impressions:1878990, reach:1347080, clicks:18487, conversions:0, ctr:0.98, cpc:3, cpm:34, month:"Mar 2026" },
  { date:"2026-03-12", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Awareness", spend:82795, impressions:2270381, reach:1815186, clicks:21648, conversions:0, ctr:0.95, cpc:4, cpm:36, month:"Mar 2026" },
  { date:"2026-03-13", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Awareness", spend:71701, impressions:1713374, reach:1065598, clicks:14272, conversions:0, ctr:0.83, cpc:5, cpm:42, month:"Mar 2026" },
  { date:"2026-03-14", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Awareness", spend:84227, impressions:2529164, reach:1731040, clicks:34256, conversions:0, ctr:1.35, cpc:2, cpm:33, month:"Mar 2026" },
  { date:"2026-03-18", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Msg/WA/DM", spend:41506, impressions:629140, reach:344517, clicks:13474, conversions:2248, ctr:2.14, cpc:3, cpm:66, month:"Mar 2026" },
  { date:"2026-03-19", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Msg/WA/DM", spend:31632, impressions:341431, reach:209709, clicks:13216, conversions:1946, ctr:3.87, cpc:2, cpm:93, month:"Mar 2026" },
  { date:"2026-03-20", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Msg/WA/DM", spend:39780, impressions:590533, reach:306714, clicks:14059, conversions:2011, ctr:2.38, cpc:3, cpm:67, month:"Mar 2026" },
  { date:"2026-03-21", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Msg/WA/DM", spend:34623, impressions:443248, reach:281317, clicks:15328, conversions:3041, ctr:3.46, cpc:2, cpm:78, month:"Mar 2026" },
  { date:"2026-03-22", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Msg/WA/DM", spend:29977, impressions:372186, reach:250233, clicks:9969, conversions:1244, ctr:2.68, cpc:3, cpm:81, month:"Mar 2026" },
  { date:"2026-03-23", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Msg/WA/DM", spend:31289, impressions:397110, reach:220677, clicks:11292, conversions:1411, ctr:2.84, cpc:3, cpm:79, month:"Mar 2026" },
  { date:"2026-03-24", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Msg/WA/DM", spend:41761, impressions:528643, reach:322506, clicks:19679, conversions:2067, ctr:3.72, cpc:2, cpm:79, month:"Mar 2026" },
  { date:"2026-03-25", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Msg/WA/DM", spend:42847, impressions:643397, reach:440902, clicks:25336, conversions:4683, ctr:3.94, cpc:2, cpm:67, month:"Mar 2026" },
  { date:"2026-03-26", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Msg/WA/DM", spend:30947, impressions:399644, reach:231876, clicks:9701, conversions:1026, ctr:2.43, cpc:3, cpm:77, month:"Mar 2026" },
  { date:"2026-03-27", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Msg/WA/DM", spend:33985, impressions:540764, reach:355181, clicks:13683, conversions:1990, ctr:2.53, cpc:2, cpm:63, month:"Mar 2026" },
  { date:"2026-03-28", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Msg/WA/DM", spend:34614, impressions:544959, reach:333053, clicks:21748, conversions:3737, ctr:3.99, cpc:2, cpm:64, month:"Mar 2026" },
  { date:"2026-03-29", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Msg/WA/DM", spend:30783, impressions:362631, reach:223321, clicks:14278, conversions:2201, ctr:3.94, cpc:2, cpm:85, month:"Mar 2026" },
  { date:"2026-03-30", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Msg/WA/DM", spend:39257, impressions:406034, reach:243851, clicks:12864, conversions:2383, ctr:3.17, cpc:3, cpm:97, month:"Mar 2026" },
  { date:"2026-03-31", brand:"Kado Bajo", platform:"Meta", campaign:"Campaign Ramadhan", objective:"Msg/WA/DM", spend:36999, impressions:404939, reach:208957, clicks:15879, conversions:1882, ctr:3.92, cpc:2, cpm:91, month:"Mar 2026" },

  // ── TIKTOK · KADO BAJO · MAR 2026
  { date:"2026-03-07", brand:"Kado Bajo", platform:"TikTok", campaign:"Campaign Ramadhan", objective:"Awareness", spend:65443, impressions:2039595, reach:1337613, clicks:24419, conversions:1436, ctr:1.20, cpc:3, cpm:32, month:"Mar 2026" },
  { date:"2026-03-08", brand:"Kado Bajo", platform:"TikTok", campaign:"Campaign Ramadhan", objective:"Awareness", spend:90728, impressions:2347886, reach:1611452, clicks:23584, conversions:978, ctr:1.00, cpc:4, cpm:39, month:"Mar 2026" },
  { date:"2026-03-09", brand:"Kado Bajo", platform:"TikTok", campaign:"Campaign Ramadhan", objective:"Awareness", spend:71891, impressions:2506902, reach:1596778, clicks:14492, conversions:552, ctr:0.58, cpc:5, cpm:29, month:"Mar 2026" },
  { date:"2026-03-10", brand:"Kado Bajo", platform:"TikTok", campaign:"Campaign Ramadhan", objective:"Awareness", spend:93678, impressions:3580979, reach:2328056, clicks:24507, conversions:665, ctr:0.68, cpc:4, cpm:26, month:"Mar 2026" },
  { date:"2026-03-11", brand:"Kado Bajo", platform:"TikTok", campaign:"Campaign Ramadhan", objective:"Awareness", spend:92372, impressions:3524016, reach:2388542, clicks:24982, conversions:1108, ctr:0.71, cpc:4, cpm:26, month:"Mar 2026" },
  { date:"2026-03-12", brand:"Kado Bajo", platform:"TikTok", campaign:"Campaign Ramadhan", objective:"Awareness", spend:68276, impressions:2499399, reach:1763889, clicks:21933, conversions:903, ctr:0.88, cpc:3, cpm:27, month:"Mar 2026" },
  { date:"2026-03-13", brand:"Kado Bajo", platform:"TikTok", campaign:"Campaign Ramadhan", objective:"Awareness", spend:63447, impressions:1925304, reach:1416676, clicks:9889, conversions:545, ctr:0.51, cpc:6, cpm:33, month:"Mar 2026" },
  { date:"2026-03-14", brand:"Kado Bajo", platform:"TikTok", campaign:"Campaign Ramadhan", objective:"Awareness", spend:89804, impressions:2703759, reach:1961852, clicks:14615, conversions:845, ctr:0.54, cpc:6, cpm:33, month:"Mar 2026" },
  { date:"2026-03-15", brand:"Kado Bajo", platform:"TikTok", campaign:"Campaign Ramadhan", objective:"Awareness", spend:66145, impressions:2160097, reach:1516648, clicks:11847, conversions:599, ctr:0.55, cpc:6, cpm:31, month:"Mar 2026" },
  { date:"2026-03-16", brand:"Kado Bajo", platform:"TikTok", campaign:"Campaign Ramadhan", objective:"Awareness", spend:67500, impressions:2194022, reach:1323020, clicks:19414, conversions:1065, ctr:0.88, cpc:3, cpm:31, month:"Mar 2026" },
  { date:"2026-03-17", brand:"Kado Bajo", platform:"TikTok", campaign:"Campaign Ramadhan", objective:"Awareness", spend:76848, impressions:2208609, reach:1537161, clicks:19380, conversions:543, ctr:0.88, cpc:4, cpm:35, month:"Mar 2026" },
  { date:"2026-03-18", brand:"Kado Bajo", platform:"TikTok", campaign:"Campaign Ramadhan", objective:"Awareness", spend:73314, impressions:2927479, reach:1866619, clicks:27954, conversions:1137, ctr:0.95, cpc:3, cpm:25, month:"Mar 2026" },
  { date:"2026-03-19", brand:"Kado Bajo", platform:"TikTok", campaign:"Campaign Ramadhan", objective:"Awareness", spend:67266, impressions:1945618, reach:1299014, clicks:14332, conversions:418, ctr:0.74, cpc:5, cpm:35, month:"Mar 2026" },
  { date:"2026-03-20", brand:"Kado Bajo", platform:"TikTok", campaign:"Campaign Ramadhan", objective:"Awareness", spend:123288, impressions:3558122, reach:2406075, clicks:19558, conversions:570, ctr:0.55, cpc:6, cpm:35, month:"Mar 2026" },

  // ── META · KADO BAJO · APR 2026
  { date:"2026-04-11", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Msg/WA/DM", spend:67471, impressions:2597920, reach:1750939, clicks:16044, conversions:0, ctr:0.62, cpc:4, cpm:26, month:"Apr 2026" },
  { date:"2026-04-11", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:98695, impressions:2950151, reach:2093390, clicks:29816, conversions:0, ctr:1.01, cpc:3, cpm:33, month:"Apr 2026" },
  { date:"2026-04-12", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Msg/WA/DM", spend:75147, impressions:2248721, reach:1740231, clicks:17928, conversions:0, ctr:0.80, cpc:4, cpm:33, month:"Apr 2026" },
  { date:"2026-04-12", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:68014, impressions:1777624, reach:1272773, clicks:19570, conversions:0, ctr:1.10, cpc:3, cpm:38, month:"Apr 2026" },
  { date:"2026-04-13", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Msg/WA/DM", spend:62900, impressions:2306759, reach:1930621, clicks:17563, conversions:0, ctr:0.76, cpc:4, cpm:27, month:"Apr 2026" },
  { date:"2026-04-13", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:90260, impressions:2542740, reach:1634321, clicks:28212, conversions:0, ctr:1.11, cpc:3, cpm:35, month:"Apr 2026" },
  { date:"2026-04-14", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Msg/WA/DM", spend:57311, impressions:2253688, reach:1643292, clicks:13958, conversions:0, ctr:0.62, cpc:4, cpm:25, month:"Apr 2026" },
  { date:"2026-04-14", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:84088, impressions:2788051, reach:1767452, clicks:37839, conversions:0, ctr:1.36, cpc:2, cpm:30, month:"Apr 2026" },
  { date:"2026-04-15", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Msg/WA/DM", spend:69464, impressions:2153379, reach:1723506, clicks:14171, conversions:0, ctr:0.66, cpc:5, cpm:32, month:"Apr 2026" },
  { date:"2026-04-15", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:70883, impressions:2037746, reach:1359253, clicks:25330, conversions:0, ctr:1.24, cpc:3, cpm:35, month:"Apr 2026" },
  { date:"2026-04-16", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Msg/WA/DM", spend:53886, impressions:1841053, reach:1563457, clicks:18396, conversions:0, ctr:1.00, cpc:3, cpm:29, month:"Apr 2026" },
  { date:"2026-04-16", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:95826, impressions:3012920, reach:1943116, clicks:38292, conversions:0, ctr:1.27, cpc:3, cpm:32, month:"Apr 2026" },
  { date:"2026-04-17", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Msg/WA/DM", spend:53905, impressions:1577426, reach:1319756, clicks:9978, conversions:0, ctr:0.63, cpc:5, cpm:34, month:"Apr 2026" },
  { date:"2026-04-17", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:74770, impressions:1729900, reach:1202327, clicks:16804, conversions:0, ctr:0.97, cpc:4, cpm:43, month:"Apr 2026" },
  { date:"2026-04-18", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Msg/WA/DM", spend:74902, impressions:3189731, reach:2173959, clicks:21842, conversions:0, ctr:0.68, cpc:3, cpm:23, month:"Apr 2026" },
  { date:"2026-04-18", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:96891, impressions:2295295, reach:1666276, clicks:25021, conversions:0, ctr:1.09, cpc:4, cpm:42, month:"Apr 2026" },
  { date:"2026-04-19", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Msg/WA/DM", spend:73677, impressions:2878619, reach:2439475, clicks:23197, conversions:0, ctr:0.81, cpc:3, cpm:26, month:"Apr 2026" },
  { date:"2026-04-19", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:74611, impressions:2299173, reach:1491696, clicks:26349, conversions:0, ctr:1.15, cpc:3, cpm:32, month:"Apr 2026" },
  { date:"2026-04-20", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Msg/WA/DM", spend:69003, impressions:1735871, reach:1232252, clicks:15771, conversions:0, ctr:0.91, cpc:4, cpm:40, month:"Apr 2026" },
  { date:"2026-04-20", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:90306, impressions:2069859, reach:1560692, clicks:27439, conversions:0, ctr:1.33, cpc:3, cpm:44, month:"Apr 2026" },
  { date:"2026-04-21", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Msg/WA/DM", spend:69248, impressions:3031580, reach:2040513, clicks:17193, conversions:0, ctr:0.57, cpc:4, cpm:23, month:"Apr 2026" },
  { date:"2026-04-21", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:71624, impressions:1985127, reach:1571413, clicks:18325, conversions:0, ctr:0.92, cpc:4, cpm:36, month:"Apr 2026" },
  { date:"2026-04-22", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Msg/WA/DM", spend:54783, impressions:1975720, reach:1523212, clicks:12569, conversions:0, ctr:0.64, cpc:4, cpm:28, month:"Apr 2026" },
  { date:"2026-04-22", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:85611, impressions:2005957, reach:1543919, clicks:19546, conversions:0, ctr:0.97, cpc:4, cpm:43, month:"Apr 2026" },
  { date:"2026-04-23", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Msg/WA/DM", spend:70658, impressions:2054165, reach:1443660, clicks:16784, conversions:0, ctr:0.82, cpc:4, cpm:34, month:"Apr 2026" },
  { date:"2026-04-23", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:83520, impressions:2673992, reach:2132718, clicks:33887, conversions:0, ctr:1.27, cpc:2, cpm:31, month:"Apr 2026" },
  { date:"2026-04-24", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Msg/WA/DM", spend:64702, impressions:2789091, reach:1864394, clicks:25744, conversions:0, ctr:0.92, cpc:3, cpm:23, month:"Apr 2026" },
  { date:"2026-04-24", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:88245, impressions:2975157, reach:2149641, clicks:42366, conversions:0, ctr:1.42, cpc:2, cpm:30, month:"Apr 2026" },
  { date:"2026-04-25", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Msg/WA/DM", spend:63013, impressions:1924014, reach:1547337, clicks:9654, conversions:0, ctr:0.50, cpc:7, cpm:33, month:"Apr 2026" },
  { date:"2026-04-25", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:92455, impressions:2646620, reach:1877973, clicks:36560, conversions:0, ctr:1.38, cpc:3, cpm:35, month:"Apr 2026" },
  { date:"2026-04-26", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Msg/WA/DM", spend:68565, impressions:2073344, reach:1576438, clicks:18050, conversions:0, ctr:0.87, cpc:4, cpm:33, month:"Apr 2026" },
  { date:"2026-04-26", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:98505, impressions:3088728, reach:2013351, clicks:34972, conversions:0, ctr:1.13, cpc:3, cpm:32, month:"Apr 2026" },
  { date:"2026-04-27", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Msg/WA/DM", spend:63120, impressions:1590207, reach:1314498, clicks:8549, conversions:0, ctr:0.54, cpc:7, cpm:40, month:"Apr 2026" },
  { date:"2026-04-27", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:76406, impressions:2303236, reach:1622076, clicks:30772, conversions:0, ctr:1.34, cpc:2, cpm:33, month:"Apr 2026" },
  { date:"2026-04-28", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Msg/WA/DM", spend:75502, impressions:2711413, reach:2078303, clicks:24871, conversions:0, ctr:0.92, cpc:3, cpm:28, month:"Apr 2026" },
  { date:"2026-04-28", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:89309, impressions:2321623, reach:1525644, clicks:19832, conversions:0, ctr:0.85, cpc:5, cpm:38, month:"Apr 2026" },
  { date:"2026-04-29", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Msg/WA/DM", spend:55850, impressions:1538606, reach:1276729, clicks:10064, conversions:0, ctr:0.65, cpc:6, cpm:36, month:"Apr 2026" },
  { date:"2026-04-29", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:77238, impressions:2047654, reach:1285260, clicks:24123, conversions:0, ctr:1.18, cpc:3, cpm:38, month:"Apr 2026" },
  { date:"2026-04-30", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Msg/WA/DM", spend:56893, impressions:2328200, reach:1931905, clicks:21660, conversions:0, ctr:0.93, cpc:3, cpm:24, month:"Apr 2026" },
  { date:"2026-04-30", brand:"Kado Bajo", platform:"Meta", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:92743, impressions:2364958, reach:1753105, clicks:30407, conversions:0, ctr:1.29, cpc:3, cpm:39, month:"Apr 2026" },

  // ── GOOGLE · KADO BAJO · APR 2026
  { date:"2026-04-11", brand:"Kado Bajo", platform:"Google", campaign:"2nd Floor Launch & CRM", objective:"Get Direction", spend:70722, impressions:353476, reach:353476, clicks:15955, conversions:3906, ctr:4.51, cpc:4, cpm:200, month:"Apr 2026" },
  { date:"2026-04-12", brand:"Kado Bajo", platform:"Google", campaign:"2nd Floor Launch & CRM", objective:"Get Direction", spend:92292, impressions:519189, reach:519189, clicks:36879, conversions:5337, ctr:7.10, cpc:3, cpm:178, month:"Apr 2026" },
  { date:"2026-04-13", brand:"Kado Bajo", platform:"Google", campaign:"2nd Floor Launch & CRM", objective:"Get Direction", spend:93756, impressions:699271, reach:699271, clicks:62102, conversions:15508, ctr:8.88, cpc:2, cpm:134, month:"Apr 2026" },
  { date:"2026-04-14", brand:"Kado Bajo", platform:"Google", campaign:"2nd Floor Launch & CRM", objective:"Get Direction", spend:92205, impressions:377961, reach:377961, clicks:29038, conversions:5027, ctr:7.68, cpc:3, cpm:244, month:"Apr 2026" },
  { date:"2026-04-15", brand:"Kado Bajo", platform:"Google", campaign:"2nd Floor Launch & CRM", objective:"Get Direction", spend:93786, impressions:676097, reach:676097, clicks:56253, conversions:14047, ctr:8.32, cpc:2, cpm:139, month:"Apr 2026" },
  { date:"2026-04-16", brand:"Kado Bajo", platform:"Google", campaign:"2nd Floor Launch & CRM", objective:"Get Direction", spend:72538, impressions:518610, reach:518610, clicks:23547, conversions:6111, ctr:4.54, cpc:3, cpm:140, month:"Apr 2026" },
  { date:"2026-04-17", brand:"Kado Bajo", platform:"Google", campaign:"2nd Floor Launch & CRM", objective:"Get Direction", spend:91475, impressions:447288, reach:447288, clicks:36153, conversions:7000, ctr:8.08, cpc:3, cpm:205, month:"Apr 2026" },
  { date:"2026-04-18", brand:"Kado Bajo", platform:"Google", campaign:"2nd Floor Launch & CRM", objective:"Get Direction", spend:73766, impressions:529741, reach:529741, clicks:27217, conversions:3369, ctr:5.14, cpc:3, cpm:139, month:"Apr 2026" },
  { date:"2026-04-19", brand:"Kado Bajo", platform:"Google", campaign:"2nd Floor Launch & CRM", objective:"Get Direction", spend:70180, impressions:372869, reach:372869, clicks:31029, conversions:8523, ctr:8.32, cpc:2, cpm:188, month:"Apr 2026" },
  { date:"2026-04-20", brand:"Kado Bajo", platform:"Google", campaign:"2nd Floor Launch & CRM", objective:"Get Direction", spend:72932, impressions:478866, reach:478866, clicks:28724, conversions:7956, ctr:6.00, cpc:3, cpm:152, month:"Apr 2026" },
  { date:"2026-04-21", brand:"Kado Bajo", platform:"Google", campaign:"2nd Floor Launch & CRM", objective:"Get Direction", spend:81159, impressions:629546, reach:629546, clicks:28812, conversions:7930, ctr:4.58, cpc:3, cpm:129, month:"Apr 2026" },
  { date:"2026-04-22", brand:"Kado Bajo", platform:"Google", campaign:"2nd Floor Launch & CRM", objective:"Get Direction", spend:69714, impressions:547264, reach:547264, clicks:29154, conversions:4004, ctr:5.33, cpc:2, cpm:127, month:"Apr 2026" },
  { date:"2026-04-23", brand:"Kado Bajo", platform:"Google", campaign:"2nd Floor Launch & CRM", objective:"Get Direction", spend:77906, impressions:538656, reach:538656, clicks:29994, conversions:6508, ctr:5.57, cpc:3, cpm:145, month:"Apr 2026" },
  { date:"2026-04-24", brand:"Kado Bajo", platform:"Google", campaign:"2nd Floor Launch & CRM", objective:"Get Direction", spend:80366, impressions:445290, reach:445290, clicks:30649, conversions:4926, ctr:6.88, cpc:3, cpm:180, month:"Apr 2026" },
  { date:"2026-04-25", brand:"Kado Bajo", platform:"Google", campaign:"2nd Floor Launch & CRM", objective:"Get Direction", spend:86681, impressions:347310, reach:347310, clicks:29965, conversions:6177, ctr:8.63, cpc:3, cpm:250, month:"Apr 2026" },
  { date:"2026-04-26", brand:"Kado Bajo", platform:"Google", campaign:"2nd Floor Launch & CRM", objective:"Get Direction", spend:87022, impressions:606351, reach:606351, clicks:44585, conversions:7948, ctr:7.35, cpc:2, cpm:144, month:"Apr 2026" },
  { date:"2026-04-27", brand:"Kado Bajo", platform:"Google", campaign:"2nd Floor Launch & CRM", objective:"Get Direction", spend:66239, impressions:440949, reach:440949, clicks:24918, conversions:4241, ctr:5.65, cpc:3, cpm:150, month:"Apr 2026" },
  { date:"2026-04-28", brand:"Kado Bajo", platform:"Google", campaign:"2nd Floor Launch & CRM", objective:"Get Direction", spend:91136, impressions:626926, reach:626926, clicks:34491, conversions:5845, ctr:5.50, cpc:3, cpm:145, month:"Apr 2026" },
  { date:"2026-04-29", brand:"Kado Bajo", platform:"Google", campaign:"2nd Floor Launch & CRM", objective:"Get Direction", spend:77069, impressions:432326, reach:432326, clicks:23684, conversions:3324, ctr:5.48, cpc:3, cpm:178, month:"Apr 2026" },
  { date:"2026-04-30", brand:"Kado Bajo", platform:"Google", campaign:"2nd Floor Launch & CRM", objective:"Get Direction", spend:59056, impressions:335543, reach:335543, clicks:29198, conversions:6667, ctr:8.70, cpc:2, cpm:176, month:"Apr 2026" },

  // ── TIKTOK · KADO BAJO · APR 2026
  { date:"2026-04-11", brand:"Kado Bajo", platform:"TikTok", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:28899, impressions:911391, reach:577051, clicks:8018, conversions:226, ctr:0.88, cpc:4, cpm:32, month:"Apr 2026" },
  { date:"2026-04-12", brand:"Kado Bajo", platform:"TikTok", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:33882, impressions:1309219, reach:902188, clicks:11898, conversions:645, ctr:0.91, cpc:3, cpm:26, month:"Apr 2026" },
  { date:"2026-04-13", brand:"Kado Bajo", platform:"TikTok", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:38718, impressions:1205999, reach:748143, clicks:6079, conversions:304, ctr:0.50, cpc:6, cpm:32, month:"Apr 2026" },
  { date:"2026-04-14", brand:"Kado Bajo", platform:"TikTok", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:39948, impressions:1571343, reach:1099159, clicks:12465, conversions:521, ctr:0.79, cpc:3, cpm:25, month:"Apr 2026" },
  { date:"2026-04-15", brand:"Kado Bajo", platform:"TikTok", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:36446, impressions:1052007, reach:670304, clicks:6875, conversions:145, ctr:0.65, cpc:5, cpm:35, month:"Apr 2026" },
  { date:"2026-04-16", brand:"Kado Bajo", platform:"TikTok", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:32706, impressions:1158325, reach:675313, clicks:9069, conversions:350, ctr:0.78, cpc:4, cpm:28, month:"Apr 2026" },
  { date:"2026-04-17", brand:"Kado Bajo", platform:"TikTok", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:29787, impressions:1030739, reach:648132, clicks:5348, conversions:227, ctr:0.52, cpc:6, cpm:29, month:"Apr 2026" },
  { date:"2026-04-18", brand:"Kado Bajo", platform:"TikTok", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:28379, impressions:990325, reach:636125, clicks:5892, conversions:129, ctr:0.59, cpc:5, cpm:29, month:"Apr 2026" },
  { date:"2026-04-19", brand:"Kado Bajo", platform:"TikTok", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:33307, impressions:957176, reach:672172, clicks:6975, conversions:245, ctr:0.73, cpc:5, cpm:35, month:"Apr 2026" },
  { date:"2026-04-20", brand:"Kado Bajo", platform:"TikTok", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:38528, impressions:1448611, reach:820466, clicks:9801, conversions:203, ctr:0.68, cpc:4, cpm:27, month:"Apr 2026" },
  { date:"2026-04-21", brand:"Kado Bajo", platform:"TikTok", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:35552, impressions:1422033, reach:967023, clicks:10593, conversions:542, ctr:0.74, cpc:3, cpm:25, month:"Apr 2026" },
  { date:"2026-04-22", brand:"Kado Bajo", platform:"TikTok", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:37125, impressions:1354655, reach:799073, clicks:15778, conversions:328, ctr:1.16, cpc:2, cpm:27, month:"Apr 2026" },
  { date:"2026-04-23", brand:"Kado Bajo", platform:"TikTok", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:30133, impressions:829183, reach:549577, clicks:8031, conversions:230, ctr:0.97, cpc:4, cpm:36, month:"Apr 2026" },
  { date:"2026-04-24", brand:"Kado Bajo", platform:"TikTok", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:37793, impressions:1385868, reach:930540, clicks:8557, conversions:427, ctr:0.62, cpc:4, cpm:27, month:"Apr 2026" },
  { date:"2026-04-25", brand:"Kado Bajo", platform:"TikTok", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:29603, impressions:1107702, reach:633184, clicks:13018, conversions:273, ctr:1.18, cpc:2, cpm:27, month:"Apr 2026" },
  { date:"2026-04-26", brand:"Kado Bajo", platform:"TikTok", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:32367, impressions:1145489, reach:720891, clicks:13410, conversions:651, ctr:1.17, cpc:2, cpm:28, month:"Apr 2026" },
  { date:"2026-04-27", brand:"Kado Bajo", platform:"TikTok", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:29064, impressions:1034103, reach:589831, clicks:9710, conversions:494, ctr:0.94, cpc:3, cpm:28, month:"Apr 2026" },
  { date:"2026-04-28", brand:"Kado Bajo", platform:"TikTok", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:39904, impressions:1368371, reach:1021856, clicks:8001, conversions:410, ctr:0.58, cpc:5, cpm:29, month:"Apr 2026" },
  { date:"2026-04-29", brand:"Kado Bajo", platform:"TikTok", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:32861, impressions:1046096, reach:681209, clicks:7944, conversions:267, ctr:0.76, cpc:4, cpm:31, month:"Apr 2026" },
  { date:"2026-04-30", brand:"Kado Bajo", platform:"TikTok", campaign:"2nd Floor Launch & CRM", objective:"Awareness", spend:54998, impressions:2081733, reach:1188893, clicks:22391, conversions:1308, ctr:1.08, cpc:2, cpm:26, month:"Apr 2026" },

  // ── GOOGLE · ZODIAC BAJO · APR 2026
  { date:"2026-04-11", brand:"Zodiac Bajo", platform:"Google", campaign:"Regular Ads", objective:"Get Direction", spend:39534, impressions:289184, reach:289184, clicks:21794, conversions:4133, ctr:7.54, cpc:2, cpm:137, month:"Apr 2026" },
  { date:"2026-04-12", brand:"Zodiac Bajo", platform:"Google", campaign:"Regular Ads", objective:"Get Direction", spend:41007, impressions:322392, reach:322392, clicks:17249, conversions:4300, ctr:5.35, cpc:2, cpm:127, month:"Apr 2026" },
  { date:"2026-04-13", brand:"Zodiac Bajo", platform:"Google", campaign:"Regular Ads", objective:"Get Direction", spend:38073, impressions:225924, reach:225924, clicks:13957, conversions:3307, ctr:6.18, cpc:3, cpm:169, month:"Apr 2026" },
  { date:"2026-04-14", brand:"Zodiac Bajo", platform:"Google", campaign:"Regular Ads", objective:"Get Direction", spend:34026, impressions:252025, reach:252025, clicks:20549, conversions:2750, ctr:8.15, cpc:2, cpm:135, month:"Apr 2026" },
  { date:"2026-04-15", brand:"Zodiac Bajo", platform:"Google", campaign:"Regular Ads", objective:"Get Direction", spend:43224, impressions:215059, reach:215059, clicks:13599, conversions:2959, ctr:6.32, cpc:3, cpm:201, month:"Apr 2026" },
  { date:"2026-04-16", brand:"Zodiac Bajo", platform:"Google", campaign:"Regular Ads", objective:"Get Direction", spend:35685, impressions:146836, reach:146836, clicks:12120, conversions:1807, ctr:8.25, cpc:3, cpm:243, month:"Apr 2026" },
  { date:"2026-04-17", brand:"Zodiac Bajo", platform:"Google", campaign:"Regular Ads", objective:"Get Direction", spend:33182, impressions:238622, reach:238622, clicks:13605, conversions:3548, ctr:5.70, cpc:2, cpm:139, month:"Apr 2026" },
  { date:"2026-04-18", brand:"Zodiac Bajo", platform:"Google", campaign:"Regular Ads", objective:"Get Direction", spend:40518, impressions:206847, reach:206847, clicks:8378, conversions:2276, ctr:4.05, cpc:5, cpm:196, month:"Apr 2026" },
  { date:"2026-04-19", brand:"Zodiac Bajo", platform:"Google", campaign:"Regular Ads", objective:"Get Direction", spend:31284, impressions:215243, reach:215243, clicks:13867, conversions:3346, ctr:6.44, cpc:2, cpm:145, month:"Apr 2026" },
  { date:"2026-04-20", brand:"Zodiac Bajo", platform:"Google", campaign:"Regular Ads", objective:"Get Direction", spend:40359, impressions:265707, reach:265707, clicks:17149, conversions:4233, ctr:6.45, cpc:2, cpm:152, month:"Apr 2026" },
  { date:"2026-04-21", brand:"Zodiac Bajo", platform:"Google", campaign:"Regular Ads", objective:"Get Direction", spend:31396, impressions:153412, reach:153412, clicks:11442, conversions:1933, ctr:7.46, cpc:3, cpm:205, month:"Apr 2026" },
  { date:"2026-04-22", brand:"Zodiac Bajo", platform:"Google", campaign:"Regular Ads", objective:"Get Direction", spend:38723, impressions:228196, reach:228196, clicks:15185, conversions:2856, ctr:6.65, cpc:3, cpm:170, month:"Apr 2026" },
  { date:"2026-04-23", brand:"Zodiac Bajo", platform:"Google", campaign:"Regular Ads", objective:"Get Direction", spend:41189, impressions:219255, reach:219255, clicks:16475, conversions:2691, ctr:7.51, cpc:3, cpm:188, month:"Apr 2026" },
  { date:"2026-04-24", brand:"Zodiac Bajo", platform:"Google", campaign:"Regular Ads", objective:"Get Direction", spend:33771, impressions:151382, reach:151382, clicks:7512, conversions:1045, ctr:4.96, cpc:4, cpm:223, month:"Apr 2026" },
  { date:"2026-04-25", brand:"Zodiac Bajo", platform:"Google", campaign:"Regular Ads", objective:"Get Direction", spend:38038, impressions:268120, reach:268120, clicks:13206, conversions:2041, ctr:4.93, cpc:3, cpm:142, month:"Apr 2026" },
  { date:"2026-04-26", brand:"Zodiac Bajo", platform:"Google", campaign:"Regular Ads", objective:"Get Direction", spend:37263, impressions:257052, reach:257052, clicks:22834, conversions:4656, ctr:8.88, cpc:2, cpm:145, month:"Apr 2026" },
  { date:"2026-04-27", brand:"Zodiac Bajo", platform:"Google", campaign:"Regular Ads", objective:"Get Direction", spend:34245, impressions:150750, reach:150750, clicks:7493, conversions:1171, ctr:4.97, cpc:5, cpm:227, month:"Apr 2026" },
  { date:"2026-04-28", brand:"Zodiac Bajo", platform:"Google", campaign:"Regular Ads", objective:"Get Direction", spend:32692, impressions:132618, reach:132618, clicks:8846, conversions:1449, ctr:6.67, cpc:4, cpm:247, month:"Apr 2026" },
  { date:"2026-04-29", brand:"Zodiac Bajo", platform:"Google", campaign:"Regular Ads", objective:"Get Direction", spend:44614, impressions:277206, reach:277206, clicks:20754, conversions:2909, ctr:7.49, cpc:2, cpm:161, month:"Apr 2026" },
  { date:"2026-04-30", brand:"Zodiac Bajo", platform:"Google", campaign:"Regular Ads", objective:"Get Direction", spend:41177, impressions:307750, reach:307750, clicks:19863, conversions:5157, ctr:6.45, cpc:2, cpm:134, month:"Apr 2026" },

  // ── META · ZODIAC BAJO · APR 2026
  { date:"2026-04-11", brand:"Zodiac Bajo", platform:"Meta", campaign:"Regular Ads", objective:"Msg/WA/DM", spend:82370, impressions:1055685, reach:566768, clicks:30413, conversions:3197, ctr:2.88, cpc:3, cpm:78, month:"Apr 2026" },
  { date:"2026-04-12", brand:"Zodiac Bajo", platform:"Meta", campaign:"Regular Ads", objective:"Msg/WA/DM", spend:94114, impressions:1210906, reach:702496, clicks:44128, conversions:4739, ctr:3.64, cpc:2, cpm:78, month:"Apr 2026" },
  { date:"2026-04-13", brand:"Zodiac Bajo", platform:"Meta", campaign:"Regular Ads", objective:"Msg/WA/DM", spend:84142, impressions:868484, reach:532005, clicks:19961, conversions:2602, ctr:2.30, cpc:4, cpm:97, month:"Apr 2026" },
  { date:"2026-04-14", brand:"Zodiac Bajo", platform:"Meta", campaign:"Regular Ads", objective:"Msg/WA/DM", spend:95805, impressions:1026139, reach:637502, clicks:36211, conversions:6484, ctr:3.53, cpc:3, cpm:93, month:"Apr 2026" },
  { date:"2026-04-15", brand:"Zodiac Bajo", platform:"Meta", campaign:"Regular Ads", objective:"Msg/WA/DM", spend:71222, impressions:935531, reach:550601, clicks:27140, conversions:5048, ctr:2.90, cpc:3, cpm:76, month:"Apr 2026" },
  { date:"2026-04-16", brand:"Zodiac Bajo", platform:"Meta", campaign:"Regular Ads", objective:"Msg/WA/DM", spend:95681, impressions:1132124, reach:704097, clicks:36704, conversions:6386, ctr:3.24, cpc:3, cpm:85, month:"Apr 2026" },
  { date:"2026-04-17", brand:"Zodiac Bajo", platform:"Meta", campaign:"Regular Ads", objective:"Msg/WA/DM", spend:94323, impressions:1060825, reach:670532, clicks:25693, conversions:2972, ctr:2.42, cpc:4, cpm:89, month:"Apr 2026" },
  { date:"2026-04-18", brand:"Zodiac Bajo", platform:"Meta", campaign:"Regular Ads", objective:"Msg/WA/DM", spend:69562, impressions:726949, reach:428973, clicks:14577, conversions:2323, ctr:2.01, cpc:5, cpm:96, month:"Apr 2026" },
  { date:"2026-04-19", brand:"Zodiac Bajo", platform:"Meta", campaign:"Regular Ads", objective:"Msg/WA/DM", spend:73320, impressions:835031, reach:534918, clicks:28507, conversions:4145, ctr:3.41, cpc:3, cpm:88, month:"Apr 2026" },
  { date:"2026-04-20", brand:"Zodiac Bajo", platform:"Meta", campaign:"Regular Ads", objective:"Msg/WA/DM", spend:85996, impressions:1336675, reach:835437, clicks:47794, conversions:7939, ctr:3.58, cpc:2, cpm:64, month:"Apr 2026" },
  { date:"2026-04-21", brand:"Zodiac Bajo", platform:"Meta", campaign:"Regular Ads", objective:"Msg/WA/DM", spend:93877, impressions:1178234, reach:741730, clicks:36397, conversions:6946, ctr:3.09, cpc:3, cpm:80, month:"Apr 2026" },
  { date:"2026-04-22", brand:"Zodiac Bajo", platform:"Meta", campaign:"Regular Ads", objective:"Msg/WA/DM", spend:90452, impressions:943274, reach:529669, clicks:21995, conversions:3846, ctr:2.33, cpc:4, cpm:96, month:"Apr 2026" },
  { date:"2026-04-23", brand:"Zodiac Bajo", platform:"Meta", campaign:"Regular Ads", objective:"Msg/WA/DM", spend:82215, impressions:964518, reach:615107, clicks:21689, conversions:3686, ctr:2.25, cpc:4, cpm:85, month:"Apr 2026" },
  { date:"2026-04-24", brand:"Zodiac Bajo", platform:"Meta", campaign:"Regular Ads", objective:"Msg/WA/DM", spend:94166, impressions:1224424, reach:631910, clicks:36580, conversions:3803, ctr:2.99, cpc:3, cpm:77, month:"Apr 2026" },
  { date:"2026-04-25", brand:"Zodiac Bajo", platform:"Meta", campaign:"Regular Ads", objective:"Msg/WA/DM", spend:77825, impressions:928758, reach:481343, clicks:23225, conversions:4556, ctr:2.50, cpc:3, cpm:84, month:"Apr 2026" },
  { date:"2026-04-26", brand:"Zodiac Bajo", platform:"Meta", campaign:"Regular Ads", objective:"Msg/WA/DM", spend:90751, impressions:1220709, reach:854391, clicks:47626, conversions:7964, ctr:3.90, cpc:2, cpm:74, month:"Apr 2026" },
  { date:"2026-04-27", brand:"Zodiac Bajo", platform:"Meta", campaign:"Regular Ads", objective:"Msg/WA/DM", spend:72624, impressions:743770, reach:441873, clicks:26125, conversions:4314, ctr:3.51, cpc:3, cpm:98, month:"Apr 2026" },
  { date:"2026-04-28", brand:"Zodiac Bajo", platform:"Meta", campaign:"Regular Ads", objective:"Msg/WA/DM", spend:93314, impressions:1034752, reach:648744, clicks:32808, conversions:4894, ctr:3.17, cpc:3, cpm:90, month:"Apr 2026" },
  { date:"2026-04-29", brand:"Zodiac Bajo", platform:"Meta", campaign:"Regular Ads", objective:"Msg/WA/DM", spend:58240, impressions:703991, reach:446349, clicks:18772, conversions:3487, ctr:2.67, cpc:3, cpm:83, month:"Apr 2026" },
  { date:"2026-04-30", brand:"Zodiac Bajo", platform:"Meta", campaign:"Regular Ads", objective:"Msg/WA/DM", spend:1, impressions:11, reach:6, clicks:0, conversions:0, ctr:0, cpc:0, cpm:91, month:"Apr 2026" },
];

// ─── HELPERS ─────────────────────────────────────────────────────────────────
const fmt = (n) => n >= 1e6 ? (n/1e6).toFixed(1)+"M" : n >= 1e3 ? (n/1e3).toFixed(1)+"K" : n?.toFixed?.(0) ?? n;
const fmtRp = (n) => "Rp "+fmt(n);
const fmtPct = (n) => (n ?? 0).toFixed(2)+"%";
const sum = (arr, k) => arr.reduce((a,b) => a + (b[k]||0), 0);
const avg = (arr, k) => arr.length ? sum(arr,k)/arr.length : 0;

const PLATFORM_COLORS = { Meta:"#1877F2", Google:"#EA4335", TikTok:"#010101" };
const PLATFORM_BG = { Meta:"#EBF3FE", Google:"#FEECEB", TikTok:"#F0F0F0" };
const BRAND_COLORS = { "Kado Bajo":"#7C3AED", "Zodiac Bajo":"#0EA5E9" };

const ALL_MONTHS = ["Feb 2026","Mar 2026","Apr 2026"];
const ALL_BRANDS = ["Kado Bajo","Zodiac Bajo"];
const ALL_PLATFORMS = ["Meta","Google","TikTok"];

// ─── MINI SPARKLINE ───────────────────────────────────────────────────────────
function Spark({ data, color="#7C3AED" }) {
  if (!data || data.length < 2) return null;
  const mn = Math.min(...data), mx = Math.max(...data);
  const range = mx - mn || 1;
  const W=80, H=28;
  const pts = data.map((v,i) => {
    const x = (i/(data.length-1))*W;
    const y = H - ((v-mn)/range)*H;
    return `${x},${y}`;
  }).join(" ");
  return (
    <svg width={W} height={H} style={{display:"block"}}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  );
}

// ─── MINI BAR ────────────────────────────────────────────────────────────────
function MiniBar({ items }) {
  const max = Math.max(...items.map(i=>i.value),1);
  return (
    <div style={{display:"flex",gap:4,alignItems:"flex-end",height:40}}>
      {items.map((item,i) => (
        <div key={i} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:2}}>
          <div style={{width:20,background:item.color,borderRadius:3,height:Math.max(4,(item.value/max)*36)}}/>
          <span style={{fontSize:9,color:"#6B7280"}}>{item.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── METRIC CARD ─────────────────────────────────────────────────────────────
function MetricCard({ label, value, sub, spark, sparkColor, icon }) {
  return (
    <div style={{background:"#fff",borderRadius:12,padding:"16px 18px",boxShadow:"0 1px 4px rgba(0,0,0,.08)",display:"flex",flexDirection:"column",gap:8,minWidth:0}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
        <span style={{fontSize:12,color:"#6B7280",fontWeight:500}}>{label}</span>
        <span style={{fontSize:18}}>{icon}</span>
      </div>
      <div style={{fontSize:22,fontWeight:700,color:"#111"}}>{value}</div>
      {sub && <div style={{fontSize:11,color:"#9CA3AF"}}>{sub}</div>}
      {spark && <Spark data={spark} color={sparkColor}/>}
    </div>
  );
}

// ─── USER MANAGEMENT MODAL ───────────────────────────────────────────────────
function UserModal({ users, onClose, onAdd, onDelete }) {
  const [form, setForm] = useState({ name:"", email:"", role:"Viewer", brand:"All" });
  const [err, setErr] = useState("");

  const handleAdd = () => {
    if (!form.name.trim() || !form.email.trim()) { setErr("Name and email required"); return; }
    if (!/^[^@]+@[^@]+\.[^@]+$/.test(form.email)) { setErr("Invalid email"); return; }
    if (users.find(u => u.email === form.email)) { setErr("Email already exists"); return; }
    onAdd({ ...form, id: Date.now(), avatar: form.name[0].toUpperCase(), createdAt: new Date().toLocaleDateString("id-ID") });
    setForm({ name:"", email:"", role:"Viewer", brand:"All" });
    setErr("");
  };

  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:16,padding:28,width:520,maxHeight:"80vh",overflowY:"auto",boxShadow:"0 20px 60px rgba(0,0,0,.2)"}} onClick={e=>e.stopPropagation()}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
          <h2 style={{margin:0,fontSize:18,fontWeight:700}}>👥 User Management</h2>
          <button onClick={onClose} style={{border:"none",background:"none",fontSize:20,cursor:"pointer",color:"#6B7280"}}>✕</button>
        </div>

        {/* Add User Form */}
        <div style={{background:"#F9FAFB",borderRadius:10,padding:16,marginBottom:20}}>
          <h3 style={{margin:"0 0 12px",fontSize:14,fontWeight:600,color:"#374151"}}>Add New User</h3>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10,marginBottom:10}}>
            <input placeholder="Full Name" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))}
              style={{padding:"8px 12px",border:"1px solid #D1D5DB",borderRadius:8,fontSize:13,outline:"none"}}/>
            <input placeholder="Email" value={form.email} onChange={e=>setForm(f=>({...f,email:e.target.value}))}
              style={{padding:"8px 12px",border:"1px solid #D1D5DB",borderRadius:8,fontSize:13,outline:"none"}}/>
            <select value={form.role} onChange={e=>setForm(f=>({...f,role:e.target.value}))}
              style={{padding:"8px 12px",border:"1px solid #D1D5DB",borderRadius:8,fontSize:13,background:"#fff"}}>
              <option>Admin</option><option>Manager</option><option>Viewer</option>
            </select>
            <select value={form.brand} onChange={e=>setForm(f=>({...f,brand:e.target.value}))}
              style={{padding:"8px 12px",border:"1px solid #D1D5DB",borderRadius:8,fontSize:13,background:"#fff"}}>
              <option>All</option><option>Kado Bajo</option><option>Zodiac Bajo</option>
            </select>
          </div>
          {err && <div style={{color:"#EF4444",fontSize:12,marginBottom:8}}>{err}</div>}
          <button onClick={handleAdd}
            style={{background:"#7C3AED",color:"#fff",border:"none",borderRadius:8,padding:"8px 20px",fontSize:13,fontWeight:600,cursor:"pointer"}}>
            + Add User
          </button>
        </div>

        {/* User List */}
        <div style={{display:"flex",flexDirection:"column",gap:8}}>
          {users.map(u => (
            <div key={u.id} style={{display:"flex",alignItems:"center",gap:12,padding:"10px 12px",background:"#F9FAFB",borderRadius:8}}>
              <div style={{width:36,height:36,borderRadius:"50%",background:u.role==="Admin"?"#7C3AED":u.role==="Manager"?"#0EA5E9":"#6B7280",
                color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontWeight:700,fontSize:14}}>
                {u.avatar}
              </div>
              <div style={{flex:1}}>
                <div style={{fontWeight:600,fontSize:13}}>{u.name}</div>
                <div style={{fontSize:11,color:"#9CA3AF"}}>{u.email} · {u.brand}</div>
              </div>
              <span style={{fontSize:11,padding:"2px 8px",borderRadius:20,background:u.role==="Admin"?"#EDE9FE":u.role==="Manager"?"#DBEAFE":"#F3F4F6",
                color:u.role==="Admin"?"#7C3AED":u.role==="Manager"?"#2563EB":"#6B7280",fontWeight:600}}>
                {u.role}
              </span>
              {!u.isDefault && (
                <button onClick={()=>onDelete(u.id)}
                  style={{border:"none",background:"none",color:"#EF4444",cursor:"pointer",fontSize:16,padding:2}}>✕</button>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── EXPORT MODAL ────────────────────────────────────────────────────────────
function ExportModal({ onClose, data }) {
  const [fmt2, setFmt2] = useState("CSV");
  const doExport = () => {
    const headers = "Date,Brand,Platform,Campaign,Objective,Spend,Impressions,Reach,Clicks,Conversions,CTR,CPC,CPM";
    const rows = data.map(r => [r.date,r.brand,r.platform,r.campaign,r.objective,r.spend,r.impressions,r.reach,r.clicks,r.conversions,r.ctr,r.cpc,r.cpm].join(","));
    const csv = [headers,...rows].join("\n");
    const blob = new Blob([csv], {type:"text/csv"});
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href=url; a.download="adsdash_export.csv"; a.click();
    onClose();
  };
  return (
    <div style={{position:"fixed",inset:0,background:"rgba(0,0,0,.45)",zIndex:1000,display:"flex",alignItems:"center",justifyContent:"center"}} onClick={onClose}>
      <div style={{background:"#fff",borderRadius:16,padding:28,width:380,boxShadow:"0 20px 60px rgba(0,0,0,.2)"}} onClick={e=>e.stopPropagation()}>
        <h2 style={{margin:"0 0 16px",fontSize:18,fontWeight:700}}>📥 Export Data</h2>
        <div style={{marginBottom:16}}>
          <label style={{fontSize:13,color:"#374151",fontWeight:500}}>Format</label>
          <div style={{display:"flex",gap:8,marginTop:8}}>
            {["CSV"].map(f => (
              <button key={f} onClick={()=>setFmt2(f)}
                style={{padding:"8px 16px",borderRadius:8,border:`2px solid ${fmt2===f?"#7C3AED":"#D1D5DB"}`,
                  background:fmt2===f?"#EDE9FE":"#fff",color:fmt2===f?"#7C3AED":"#374151",cursor:"pointer",fontSize:13,fontWeight:600}}>
                {f}
              </button>
            ))}
          </div>
        </div>
        <div style={{fontSize:12,color:"#6B7280",marginBottom:16}}>
          {data.length} rows will be exported with current filters applied.
        </div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={onClose} style={{flex:1,padding:"10px",borderRadius:8,border:"1px solid #D1D5DB",background:"#fff",cursor:"pointer",fontSize:13}}>Cancel</button>
          <button onClick={doExport} style={{flex:1,padding:"10px",borderRadius:8,border:"none",background:"#7C3AED",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:600}}>Download</button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ─────────────────────────────────────────────────────────────────
export default function App() {
  // ── state
  const [activePage, setActivePage] = useState("dashboard");
  const [selectedBrand, setSelectedBrand] = useState("All");
  const [selectedPlatform, setSelectedPlatform] = useState("All");
  const [selectedMonth, setSelectedMonth] = useState("All");
  const [showUserModal, setShowUserModal] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [users, setUsers] = useState([
    { id:1, name:"Admin Maharani", email:"admin@maharani.id", role:"Admin", brand:"All", avatar:"A", isDefault:true, createdAt:"01/01/2026" },
    { id:2, name:"Ika Putri", email:"ika@maharani.id", role:"Manager", brand:"Kado Bajo", avatar:"I", isDefault:true, createdAt:"01/02/2026" },
    { id:3, name:"Pixeldew", email:"pixel@dew.id", role:"Viewer", brand:"Zodiac Bajo", avatar:"P", isDefault:true, createdAt:"01/03/2026" },
  ]);
  const [currentUser] = useState(users[0]);

  // ── filtered data
  const filtered = useMemo(() => {
    return RAW_DATA.filter(r =>
      (selectedBrand === "All" || r.brand === selectedBrand) &&
      (selectedPlatform === "All" || r.platform === selectedPlatform) &&
      (selectedMonth === "All" || r.month === selectedMonth)
    );
  }, [selectedBrand, selectedPlatform, selectedMonth]);

  // ── totals
  const totals = useMemo(() => ({
    spend: sum(filtered, "spend"),
    impressions: sum(filtered, "impressions"),
    reach: sum(filtered, "reach"),
    clicks: sum(filtered, "clicks"),
    conversions: sum(filtered, "conversions"),
    ctr: avg(filtered, "ctr"),
    cpc: avg(filtered, "cpc"),
    cpm: avg(filtered, "cpm"),
  }), [filtered]);

  // ── spend by platform
  const spendByPlatform = useMemo(() => {
    return ALL_PLATFORMS.map(p => ({
      label: p, color: PLATFORM_COLORS[p],
      value: sum(filtered.filter(r=>r.platform===p), "spend")
    }));
  }, [filtered]);

  // ── spend by brand
  const spendByBrand = useMemo(() => {
    return ALL_BRANDS.map(b => ({
      label: b.replace(" Bajo",""), color: BRAND_COLORS[b],
      value: sum(filtered.filter(r=>r.brand===b), "spend")
    }));
  }, [filtered]);

  // ── daily spend spark (last 20 points of filtered)
  const dailySpend = useMemo(() => {
    const byDate = {};
    filtered.forEach(r => { byDate[r.date] = (byDate[r.date]||0) + r.spend; });
    return Object.values(byDate).slice(-20);
  }, [filtered]);

  // ── platform breakdown table
  const platformBreakdown = useMemo(() => {
    return ALL_PLATFORMS.map(p => {
      const rows = filtered.filter(r => r.platform === p);
      if (!rows.length) return null;
      return {
        platform: p,
        spend: sum(rows,"spend"),
        impressions: sum(rows,"impressions"),
        clicks: sum(rows,"clicks"),
        conversions: sum(rows,"conversions"),
        ctr: avg(rows,"ctr"),
        cpc: avg(rows,"cpc"),
        cpm: avg(rows,"cpm"),
      };
    }).filter(Boolean);
  }, [filtered]);

  // ── brand breakdown
  const brandBreakdown = useMemo(() => {
    return ALL_BRANDS.map(b => {
      const rows = filtered.filter(r => r.brand === b);
      if (!rows.length) return null;
      return {
        brand: b,
        spend: sum(rows,"spend"),
        impressions: sum(rows,"impressions"),
        clicks: sum(rows,"clicks"),
        conversions: sum(rows,"conversions"),
        ctr: avg(rows,"ctr"),
        cpc: avg(rows,"cpc"),
      };
    }).filter(Boolean);
  }, [filtered]);

  // ─── NAV items
  const navItems = [
    { id:"dashboard", icon:"📊", label:"Dashboard" },
    { id:"platforms", icon:"📱", label:"By Platform" },
    { id:"brands", icon:"🏷️", label:"By Brand" },
    { id:"campaigns", icon:"📣", label:"Campaigns" },
    { id:"raw", icon:"📋", label:"Raw Data" },
  ];

  const FilterBar = () => (
    <div style={{display:"flex",gap:10,flexWrap:"wrap",marginBottom:20}}>
      {[
        { label:"Brand", val:selectedBrand, set:setSelectedBrand, opts:["All",...ALL_BRANDS] },
        { label:"Platform", val:selectedPlatform, set:setSelectedPlatform, opts:["All",...ALL_PLATFORMS] },
        { label:"Month", val:selectedMonth, set:setSelectedMonth, opts:["All",...ALL_MONTHS] },
      ].map(f => (
        <div key={f.label} style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{fontSize:12,color:"#6B7280",fontWeight:500}}>{f.label}:</span>
          <select value={f.val} onChange={e=>f.set(e.target.value)}
            style={{padding:"6px 10px",border:"1px solid #E5E7EB",borderRadius:8,fontSize:13,background:"#fff",cursor:"pointer",outline:"none"}}>
            {f.opts.map(o=><option key={o}>{o}</option>)}
          </select>
        </div>
      ))}
      <button onClick={()=>{setSelectedBrand("All");setSelectedPlatform("All");setSelectedMonth("All");}}
        style={{padding:"6px 12px",border:"1px solid #E5E7EB",borderRadius:8,fontSize:12,background:"#fff",cursor:"pointer",color:"#6B7280"}}>
        Reset
      </button>
      <span style={{marginLeft:"auto",fontSize:12,color:"#9CA3AF",alignSelf:"center"}}>{filtered.length} records</span>
    </div>
  );

  // ─── PAGE: DASHBOARD
  const PageDashboard = () => (
    <div>
      <FilterBar/>
      {/* KPI Cards */}
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12,marginBottom:20}}>
        <MetricCard label="Total Spend" value={fmtRp(totals.spend)} icon="💰" spark={dailySpend} sparkColor="#7C3AED"/>
        <MetricCard label="Impressions" value={fmt(totals.impressions)} icon="👁️" sub="Total tayangan"/>
        <MetricCard label="Total Clicks" value={fmt(totals.clicks)} icon="🖱️" sub={`CTR avg ${fmtPct(totals.ctr)}`}/>
        <MetricCard label="Conversions" value={fmt(totals.conversions)} icon="✅" sub={`CPC avg ${fmtRp(totals.cpc)}`}/>
      </div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:12,marginBottom:20}}>
        <MetricCard label="Reach" value={fmt(totals.reach)} icon="📡"/>
        <MetricCard label="Avg CTR" value={fmtPct(totals.ctr)} icon="📈"/>
        <MetricCard label="Avg CPM" value={fmtRp(totals.cpm)} icon="💸"/>
      </div>

      {/* Platform + Brand split */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16,marginBottom:20}}>
        <div style={{background:"#fff",borderRadius:12,padding:16,boxShadow:"0 1px 4px rgba(0,0,0,.08)"}}>
          <h3 style={{margin:"0 0 14px",fontSize:14,fontWeight:700}}>Spend by Platform</h3>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {spendByPlatform.filter(p=>p.value>0).map(p => (
              <div key={p.label}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:13,fontWeight:500,display:"flex",alignItems:"center",gap:6}}>
                    <span style={{width:10,height:10,borderRadius:"50%",background:p.color,display:"inline-block"}}/>
                    {p.label}
                  </span>
                  <span style={{fontSize:13,fontWeight:600}}>{fmtRp(p.value)}</span>
                </div>
                <div style={{height:6,background:"#F3F4F6",borderRadius:3}}>
                  <div style={{height:6,borderRadius:3,background:p.color,width:`${(p.value/Math.max(...spendByPlatform.map(x=>x.value),1))*100}%`}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div style={{background:"#fff",borderRadius:12,padding:16,boxShadow:"0 1px 4px rgba(0,0,0,.08)"}}>
          <h3 style={{margin:"0 0 14px",fontSize:14,fontWeight:700}}>Spend by Brand</h3>
          <div style={{display:"flex",flexDirection:"column",gap:10}}>
            {spendByBrand.filter(b=>b.value>0).map(b => (
              <div key={b.label}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:13,fontWeight:500,display:"flex",alignItems:"center",gap:6}}>
                    <span style={{width:10,height:10,borderRadius:"50%",background:b.color,display:"inline-block"}}/>
                    {b.label}
                  </span>
                  <span style={{fontSize:13,fontWeight:600}}>{fmtRp(b.value)}</span>
                </div>
                <div style={{height:6,background:"#F3F4F6",borderRadius:3}}>
                  <div style={{height:6,borderRadius:3,background:b.color,width:`${(b.value/Math.max(...spendByBrand.map(x=>x.value),1))*100}%`}}/>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Monthly Summary */}
      <div style={{background:"#fff",borderRadius:12,padding:16,boxShadow:"0 1px 4px rgba(0,0,0,.08)"}}>
        <h3 style={{margin:"0 0 14px",fontSize:14,fontWeight:700}}>Monthly Summary</h3>
        <div style={{overflowX:"auto"}}>
          <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
            <thead>
              <tr style={{borderBottom:"2px solid #F3F4F6"}}>
                {["Month","Spend","Impressions","Clicks","Conversions","CTR","CPM"].map(h=>(
                  <th key={h} style={{textAlign:"left",padding:"8px 12px",color:"#6B7280",fontWeight:600,fontSize:12}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ALL_MONTHS.map(m => {
                const rows = filtered.filter(r=>r.month===m);
                if (!rows.length) return null;
                return (
                  <tr key={m} style={{borderBottom:"1px solid #F9FAFB"}}>
                    <td style={{padding:"10px 12px",fontWeight:600}}>{m}</td>
                    <td style={{padding:"10px 12px"}}>{fmtRp(sum(rows,"spend"))}</td>
                    <td style={{padding:"10px 12px"}}>{fmt(sum(rows,"impressions"))}</td>
                    <td style={{padding:"10px 12px"}}>{fmt(sum(rows,"clicks"))}</td>
                    <td style={{padding:"10px 12px"}}>{fmt(sum(rows,"conversions"))}</td>
                    <td style={{padding:"10px 12px"}}>{fmtPct(avg(rows,"ctr"))}</td>
                    <td style={{padding:"10px 12px"}}>{fmtRp(avg(rows,"cpm"))}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  // ─── PAGE: PLATFORMS
  const PagePlatforms = () => (
    <div>
      <FilterBar/>
      <div style={{display:"flex",flexDirection:"column",gap:16}}>
        {platformBreakdown.map(p => (
          <div key={p.platform} style={{background:"#fff",borderRadius:12,padding:20,boxShadow:"0 1px 4px rgba(0,0,0,.08)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
              <div style={{width:36,height:36,borderRadius:10,background:PLATFORM_BG[p.platform],display:"flex",alignItems:"center",justifyContent:"center"}}>
                <span style={{fontSize:18}}>{p.platform==="Meta"?"📘":p.platform==="Google"?"🔴":"🎵"}</span>
              </div>
              <div>
                <h3 style={{margin:0,fontSize:16,fontWeight:700}}>{p.platform} Ads</h3>
                <span style={{fontSize:12,color:"#9CA3AF"}}>Performance Overview</span>
              </div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:12}}>
              {[
                {l:"Spend",v:fmtRp(p.spend)},{l:"Impressions",v:fmt(p.impressions)},
                {l:"Clicks",v:fmt(p.clicks)},{l:"Conversions",v:fmt(p.conversions)},
                {l:"CTR",v:fmtPct(p.ctr)},{l:"CPC",v:fmtRp(p.cpc)},{l:"CPM",v:fmtRp(p.cpm)},
              ].map(m=>(
                <div key={m.l} style={{background:"#F9FAFB",borderRadius:8,padding:"10px 12px"}}>
                  <div style={{fontSize:11,color:"#9CA3AF",marginBottom:4}}>{m.l}</div>
                  <div style={{fontSize:16,fontWeight:700,color:"#111"}}>{m.v}</div>
                </div>
              ))}
            </div>
          </div>
        ))}
        {platformBreakdown.length === 0 && (
          <div style={{textAlign:"center",padding:60,color:"#9CA3AF"}}>No data for selected filters</div>
        )}
      </div>
    </div>
  );

  // ─── PAGE: BRANDS
  const PageBrands = () => (
    <div>
      <FilterBar/>
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
        {brandBreakdown.map(b => (
          <div key={b.brand} style={{background:"#fff",borderRadius:12,padding:20,boxShadow:"0 1px 4px rgba(0,0,0,.08)"}}>
            <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:16}}>
              <div style={{width:10,height:36,borderRadius:4,background:BRAND_COLORS[b.brand]}}/>
              <div>
                <h3 style={{margin:0,fontSize:16,fontWeight:700}}>{b.brand}</h3>
                <span style={{fontSize:12,color:"#9CA3AF"}}>Brand Performance</span>
              </div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:10}}>
              {[
                {l:"Total Spend",v:fmtRp(b.spend),icon:"💰"},
                {l:"Impressions",v:fmt(b.impressions),icon:"👁️"},
                {l:"Clicks",v:fmt(b.clicks),icon:"🖱️"},
                {l:"Conversions",v:fmt(b.conversions),icon:"✅"},
                {l:"Avg CTR",v:fmtPct(b.ctr),icon:"📈"},
                {l:"Avg CPC",v:fmtRp(b.cpc),icon:"💸"},
              ].map(m=>(
                <div key={m.l} style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"8px 0",borderBottom:"1px solid #F3F4F6"}}>
                  <span style={{fontSize:13,color:"#6B7280"}}>{m.icon} {m.l}</span>
                  <span style={{fontSize:14,fontWeight:700}}>{m.v}</span>
                </div>
              ))}
            </div>
            {/* Platform breakdown for brand */}
            <div style={{marginTop:14}}>
              <div style={{fontSize:12,fontWeight:600,color:"#374151",marginBottom:8}}>Spend by Platform</div>
              <MiniBar items={ALL_PLATFORMS.map(p=>({
                label:p,color:PLATFORM_COLORS[p],
                value:sum(filtered.filter(r=>r.brand===b.brand&&r.platform===p),"spend")
              }))}/>
            </div>
          </div>
        ))}
        {brandBreakdown.length === 0 && (
          <div style={{textAlign:"center",padding:60,color:"#9CA3AF",gridColumn:"1/-1"}}>No data for selected filters</div>
        )}
      </div>
    </div>
  );

  // ─── PAGE: CAMPAIGNS
  const PageCampaigns = () => {
    const campaigns = useMemo(() => {
      const map = {};
      filtered.forEach(r => {
        const key = `${r.brand}|${r.platform}|${r.campaign}`;
        if (!map[key]) map[key] = { brand:r.brand, platform:r.platform, campaign:r.campaign, spend:0, impressions:0, clicks:0, conversions:0, ctrs:[], cpcs:[] };
        map[key].spend += r.spend;
        map[key].impressions += r.impressions;
        map[key].clicks += r.clicks;
        map[key].conversions += r.conversions;
        map[key].ctrs.push(r.ctr);
        map[key].cpcs.push(r.cpc);
      });
      return Object.values(map).map(m=>({...m,ctr:m.ctrs.reduce((a,b)=>a+b,0)/m.ctrs.length,cpc:m.cpcs.reduce((a,b)=>a+b,0)/m.cpcs.length}));
    }, []);

    return (
      <div>
        <FilterBar/>
        <div style={{background:"#fff",borderRadius:12,boxShadow:"0 1px 4px rgba(0,0,0,.08)",overflow:"hidden"}}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:13}}>
              <thead>
                <tr style={{background:"#F9FAFB",borderBottom:"2px solid #F3F4F6"}}>
                  {["Brand","Platform","Campaign","Spend","Impressions","Clicks","Conversions","CTR","CPC"].map(h=>(
                    <th key={h} style={{textAlign:"left",padding:"12px 14px",color:"#374151",fontWeight:700,fontSize:12,whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {campaigns.map((c,i)=>(
                  <tr key={i} style={{borderBottom:"1px solid #F9FAFB",background:i%2===0?"#fff":"#FAFAFA"}}>
                    <td style={{padding:"11px 14px"}}>
                      <span style={{display:"flex",alignItems:"center",gap:6}}>
                        <span style={{width:8,height:8,borderRadius:"50%",background:BRAND_COLORS[c.brand]||"#888",display:"inline-block"}}/>
                        {c.brand}
                      </span>
                    </td>
                    <td style={{padding:"11px 14px"}}>
                      <span style={{padding:"2px 8px",borderRadius:20,background:PLATFORM_BG[c.platform],color:PLATFORM_COLORS[c.platform],fontWeight:600,fontSize:12}}>
                        {c.platform}
                      </span>
                    </td>
                    <td style={{padding:"11px 14px",maxWidth:180,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{c.campaign}</td>
                    <td style={{padding:"11px 14px",fontWeight:600}}>{fmtRp(c.spend)}</td>
                    <td style={{padding:"11px 14px"}}>{fmt(c.impressions)}</td>
                    <td style={{padding:"11px 14px"}}>{fmt(c.clicks)}</td>
                    <td style={{padding:"11px 14px"}}>{fmt(c.conversions)}</td>
                    <td style={{padding:"11px 14px"}}>{fmtPct(c.ctr)}</td>
                    <td style={{padding:"11px 14px"}}>{fmtRp(c.cpc)}</td>
                  </tr>
                ))}
                {campaigns.length===0 && (
                  <tr><td colSpan={9} style={{textAlign:"center",padding:60,color:"#9CA3AF"}}>No data</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  // ─── PAGE: RAW DATA
  const PageRaw = () => {
    const [page, setPage] = useState(0);
    const PER_PAGE = 20;
    const total = filtered.length;
    const pages = Math.ceil(total/PER_PAGE);
    const slice = filtered.slice(page*PER_PAGE, page*PER_PAGE+PER_PAGE);

    return (
      <div>
        <FilterBar/>
        <div style={{background:"#fff",borderRadius:12,boxShadow:"0 1px 4px rgba(0,0,0,.08)",overflow:"hidden"}}>
          <div style={{overflowX:"auto"}}>
            <table style={{width:"100%",borderCollapse:"collapse",fontSize:12}}>
              <thead>
                <tr style={{background:"#F9FAFB",borderBottom:"2px solid #F3F4F6"}}>
                  {["Date","Brand","Platform","Campaign","Objective","Spend","Impressions","Reach","Clicks","Conv","CTR","CPC","CPM"].map(h=>(
                    <th key={h} style={{textAlign:"left",padding:"10px 12px",color:"#374151",fontWeight:700,whiteSpace:"nowrap"}}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {slice.map((r,i)=>(
                  <tr key={i} style={{borderBottom:"1px solid #F9FAFB",background:i%2===0?"#fff":"#FAFAFA"}}>
                    <td style={{padding:"9px 12px",whiteSpace:"nowrap"}}>{r.date.replace("2026-","")}</td>
                    <td style={{padding:"9px 12px"}}><span style={{fontSize:11,color:BRAND_COLORS[r.brand]||"#888",fontWeight:600}}>{r.brand.split(" ")[0]}</span></td>
                    <td style={{padding:"9px 12px"}}>
                      <span style={{padding:"2px 6px",borderRadius:20,background:PLATFORM_BG[r.platform],color:PLATFORM_COLORS[r.platform],fontWeight:600,fontSize:11}}>
                        {r.platform}
                      </span>
                    </td>
                    <td style={{padding:"9px 12px",maxWidth:130,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}}>{r.campaign}</td>
                    <td style={{padding:"9px 12px",fontSize:11,color:"#6B7280"}}>{r.objective}</td>
                    <td style={{padding:"9px 12px",fontWeight:600}}>{fmtRp(r.spend)}</td>
                    <td style={{padding:"9px 12px"}}>{fmt(r.impressions)}</td>
                    <td style={{padding:"9px 12px"}}>{fmt(r.reach)}</td>
                    <td style={{padding:"9px 12px"}}>{fmt(r.clicks)}</td>
                    <td style={{padding:"9px 12px"}}>{fmt(r.conversions)}</td>
                    <td style={{padding:"9px 12px"}}>{fmtPct(r.ctr)}</td>
                    <td style={{padding:"9px 12px"}}>{fmtRp(r.cpc)}</td>
                    <td style={{padding:"9px 12px"}}>{fmtRp(r.cpm)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"12px 16px",borderTop:"1px solid #F3F4F6"}}>
            <span style={{fontSize:12,color:"#9CA3AF"}}>Showing {page*PER_PAGE+1}–{Math.min((page+1)*PER_PAGE,total)} of {total}</span>
            <div style={{display:"flex",gap:6}}>
              <button disabled={page===0} onClick={()=>setPage(p=>p-1)}
                style={{padding:"6px 12px",borderRadius:8,border:"1px solid #E5E7EB",background:page===0?"#F9FAFB":"#fff",cursor:page===0?"not-allowed":"pointer",fontSize:12}}>
                ← Prev
              </button>
              {Array.from({length:Math.min(pages,5)}).map((_,i)=>(
                <button key={i} onClick={()=>setPage(i)}
                  style={{padding:"6px 10px",borderRadius:8,border:"1px solid #E5E7EB",
                    background:page===i?"#7C3AED":"#fff",color:page===i?"#fff":"#374151",cursor:"pointer",fontSize:12,fontWeight:page===i?700:400}}>
                  {i+1}
                </button>
              ))}
              <button disabled={page>=pages-1} onClick={()=>setPage(p=>p+1)}
                style={{padding:"6px 12px",borderRadius:8,border:"1px solid #E5E7EB",background:page>=pages-1?"#F9FAFB":"#fff",cursor:page>=pages-1?"not-allowed":"pointer",fontSize:12}}>
                Next →
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const pageMap = {
    dashboard: <PageDashboard/>,
    platforms: <PagePlatforms/>,
    brands: <PageBrands/>,
    campaigns: <PageCampaigns/>,
    raw: <PageRaw/>,
  };

  const pageTitles = {
    dashboard:"Dashboard Overview", platforms:"Platform Analysis",
    brands:"Brand Performance", campaigns:"Campaign Details", raw:"Raw Data"
  };

  // ─── RENDER
  return (
    <div style={{display:"flex",minHeight:"100vh",background:"#F3F4F6",fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      {/* SIDEBAR */}
      <div style={{width:sidebarOpen?220:64,background:"#1E1B4B",transition:"width .2s",display:"flex",flexDirection:"column",flexShrink:0}}>
        {/* Logo */}
        <div style={{padding:"20px 16px",borderBottom:"1px solid rgba(255,255,255,.1)",display:"flex",alignItems:"center",gap:10}}>
          <div style={{width:32,height:32,background:"linear-gradient(135deg,#7C3AED,#06B6D4)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>
            <span style={{fontSize:16}}>📊</span>
          </div>
          {sidebarOpen && <span style={{color:"#fff",fontWeight:800,fontSize:16,letterSpacing:-.5}}>AdsDash</span>}
        </div>

        {/* Nav */}
        <nav style={{flex:1,padding:"12px 8px",display:"flex",flexDirection:"column",gap:2}}>
          {navItems.map(item => (
            <button key={item.id} onClick={()=>setActivePage(item.id)}
              style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:8,border:"none",
                background:activePage===item.id?"rgba(124,58,237,.3)":"transparent",
                color:activePage===item.id?"#C4B5FD":"rgba(255,255,255,.6)",cursor:"pointer",textAlign:"left",
                transition:"all .15s",fontWeight:activePage===item.id?600:400,fontSize:14}}>
              <span style={{fontSize:18,flexShrink:0}}>{item.icon}</span>
              {sidebarOpen && <span>{item.label}</span>}
            </button>
          ))}
        </nav>

        {/* Bottom actions */}
        <div style={{padding:"12px 8px",borderTop:"1px solid rgba(255,255,255,.1)",display:"flex",flexDirection:"column",gap:2}}>
          <button onClick={()=>setShowUserModal(true)}
            style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:8,border:"none",
              background:"transparent",color:"rgba(255,255,255,.6)",cursor:"pointer",textAlign:"left",fontSize:14}}>
            <span style={{fontSize:18,flexShrink:0}}>👥</span>
            {sidebarOpen && <span>Users</span>}
          </button>
          <button onClick={()=>setShowExportModal(true)}
            style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:8,border:"none",
              background:"transparent",color:"rgba(255,255,255,.6)",cursor:"pointer",textAlign:"left",fontSize:14}}>
            <span style={{fontSize:18,flexShrink:0}}>📥</span>
            {sidebarOpen && <span>Export</span>}
          </button>
          <button onClick={()=>setSidebarOpen(s=>!s)}
            style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",borderRadius:8,border:"none",
              background:"transparent",color:"rgba(255,255,255,.4)",cursor:"pointer",textAlign:"left",fontSize:14}}>
            <span style={{fontSize:18,flexShrink:0}}>{sidebarOpen?"◀":"▶"}</span>
            {sidebarOpen && <span>Collapse</span>}
          </button>
        </div>

        {/* User badge */}
        {sidebarOpen && (
          <div style={{padding:"12px 16px",background:"rgba(0,0,0,.2)",display:"flex",alignItems:"center",gap:8}}>
            <div style={{width:28,height:28,borderRadius:"50%",background:"#7C3AED",color:"#fff",display:"flex",alignItems:"center",justifyContent:"center",fontSize:12,fontWeight:700}}>
              {currentUser.avatar}
            </div>
            <div>
              <div style={{color:"#fff",fontSize:12,fontWeight:600}}>{currentUser.name}</div>
              <div style={{color:"rgba(255,255,255,.4)",fontSize:10}}>{currentUser.role}</div>
            </div>
          </div>
        )}
      </div>

      {/* MAIN */}
      <div style={{flex:1,display:"flex",flexDirection:"column",overflow:"hidden"}}>
        {/* Topbar */}
        <div style={{background:"#fff",borderBottom:"1px solid #E5E7EB",padding:"14px 24px",display:"flex",alignItems:"center",justifyContent:"space-between",flexShrink:0}}>
          <div>
            <h1 style={{margin:0,fontSize:20,fontWeight:800,color:"#111"}}>{pageTitles[activePage]}</h1>
            <p style={{margin:0,fontSize:12,color:"#9CA3AF"}}>Maharani Digital Hub · Data: Feb–Apr 2026</p>
          </div>
          <div style={{display:"flex",gap:10}}>
            <button onClick={()=>setShowExportModal(true)}
              style={{padding:"8px 16px",borderRadius:8,border:"1px solid #E5E7EB",background:"#fff",cursor:"pointer",fontSize:13,display:"flex",alignItems:"center",gap:6}}>
              📥 Export
            </button>
            <button onClick={()=>setShowUserModal(true)}
              style={{padding:"8px 16px",borderRadius:8,border:"none",background:"#7C3AED",color:"#fff",cursor:"pointer",fontSize:13,fontWeight:600,display:"flex",alignItems:"center",gap:6}}>
              👥 Users ({users.length})
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{flex:1,overflowY:"auto",padding:24}}>
          {pageMap[activePage]}
        </div>
      </div>

      {/* Modals */}
      {showUserModal && (
        <UserModal
          users={users}
          onClose={()=>setShowUserModal(false)}
          onAdd={u=>setUsers(us=>[...us,u])}
          onDelete={id=>setUsers(us=>us.filter(u=>u.id!==id))}
        />
      )}
      {showExportModal && (
        <ExportModal onClose={()=>setShowExportModal(false)} data={filtered}/>
      )}
    </div>
  );
}
