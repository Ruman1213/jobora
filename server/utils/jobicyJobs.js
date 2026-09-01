const JOBICY_URL = "https://jobicy.com/api/v2/remote-jobs?count=50";
const CACHE_MS = 10 * 60 * 1000;

let cache = {
  fetchedAt: 0,
  jobs: [],
};

const mapCategory = (industries = []) => {
  const text = industries.join(" ").toLowerCase();

  if (text.includes("market")) return "Marketing";
  if (text.includes("design") || text.includes("ui") || text.includes("ux")) {
    return "Designing";
  }
  if (text.includes("data") || text.includes("analyst") || text.includes("ml")) {
    return "Data Science";
  }
  if (text.includes("network") || text.includes("devops") || text.includes("cloud")) {
    return "Networking";
  }
  if (text.includes("security") || text.includes("cyber")) {
    return "Cybersecurity";
  }
  if (
    text.includes("manage") ||
    text.includes("sales") ||
    text.includes("hr") ||
    text.includes("recruit")
  ) {
    return "Management";
  }

  return "Programming";
};

const mapLevel = (level = "") => {
  const text = String(level).toLowerCase();

  if (text.includes("entry") || text.includes("junior") || text.includes("intern")) {
    return "Beginner Level";
  }
  if (text.includes("mid") || text.includes("associate")) {
    return "Intermediate Level";
  }
  if (
    text.includes("senior") ||
    text.includes("lead") ||
    text.includes("director") ||
    text.includes("exec")
  ) {
    return "Senior Level";
  }

  return "Intermediate Level";
};

export const mapJobicyJob = (job) => {
  const salary = Number(job.salaryMax || job.salaryMin || 0);

  return {
    _id: `jobicy-${job.id}`,
    title: job.jobTitle || "Untitled role",
    description: job.jobDescription || job.jobExcerpt || "<p>No description.</p>",
    location: job.jobGeo || "Remote",
    category: mapCategory(job.jobIndustry),
    level: mapLevel(job.jobLevel),
    salary,
    date: job.pubDate ? new Date(job.pubDate).getTime() : Date.now(),
    visible: true,
    source: "jobicy",
    applyUrl: job.url,
    companyId: {
      _id: `jobicy-co-${job.companyName || "unknown"}`,
      name: job.companyName || "Company",
      image: job.companyLogo || "",
    },
  };
};

export const getJobicyJobs = async () => {
  const now = Date.now();

  if (cache.jobs.length && now - cache.fetchedAt < CACHE_MS) {
    return cache.jobs;
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 8000);

  try {
    const response = await fetch(JOBICY_URL, {
      signal: controller.signal,
      headers: { Accept: "application/json" },
    });

    if (!response.ok) {
      throw new Error(`Jobicy responded ${response.status}`);
    }

    const data = await response.json();
    const jobs = (data.jobs || []).map(mapJobicyJob);

    cache = {
      fetchedAt: now,
      jobs,
    };

    return jobs;
  } catch (error) {
    console.log("Jobicy fetch error:", error.message);
    return cache.jobs;
  } finally {
    clearTimeout(timer);
  }
};
