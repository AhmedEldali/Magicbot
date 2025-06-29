// D:\Magicbot\FrontEnd\Magicbot\app\projects\page.jsx

 import Image from "next/image"; // Commented out
 import bg from "../../../../public/background/projects-background.png"; // Commented out
 import ProjectList from "@/components/projects";
 import RenderModel from "@/components/RenderModel"; // NOW COMMENTED OUT
 import dynamic from "next/dynamic"; // NOW COMMENTED OUT

// Dynamically import Staff model and disable SSR
const Staff = dynamic(() => import("@/components/models/Staff"), {
  ssr: false,
});

export const metadata = {
  title: "Projects",
};

// Define an async function to fetch data for this Server Component
async function getProjectsFromCMS() {
  const cmsUrl = process.env.NEXT_PUBLIC_CMS_URL; // Reads from your .env.local

  if (!cmsUrl) {
    console.error("NEXT_PUBLIC_CMS_URL is not defined! Cannot fetch projects.");
    return [];
  }

  try {
    const res = await fetch(`${cmsUrl}/api/ai_bots?depth=1`, {
      next: { revalidate: 60 }, // Revalidate data every 60 seconds
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ message: res.statusText }));
      throw new Error(`Failed to fetch AI bots: ${errorData.message || res.statusText}`);
    }

    const data = await res.json();
    const aiBots = data.docs || []; 

    // Map Payload data fields to what your ProjectLayout expects: { name, description, date, demoLink }
    const mappedProjects = aiBots.map(bot => ({
      id: bot.id, 
      name: bot.bot_name, 
      description: bot.service_type, 
      date: bot.createdAt, 
      demoLink: bot.demo_url || '#', // Use bot.demo_url from Payload, with '#' as a fallback
    }));

    console.log("Mapped Projects Data from CMS:", mappedProjects); // For debugging
    return mappedProjects;
  } catch (error) {
    console.error("Error fetching AI bots for projects page:", error);
    return []; 
  }
}

// The ProjectsPage component is an async Server Component
export default async function ProjectsPage() { // Changed function name from Home to ProjectsPage
  const projectsData = await getProjectsFromCMS(); // Fetch data from CMS

  return (
    <>
      <Image
        src={bg}
        alt="Next.js Portfolio website's projects page background image"
        className="-z-50 fixed top-0 left-0 w-full h-full object-cover object-center opacity-50"
        priority
        sizes="100vw"
      />
      <ProjectList projects={projectsData} />

      {/*
        The 3D Staff model is commented out for faster development.
        Uncomment this ONLY after you have verified all data is loading correctly
        and have placed the correct `Staff.glb` file in `public/models/`.
      */}
      <div className="flex items-center justify-center fixed  top-16  lg:top-20 -translate-x-1/2 lg:translate-x-0 -z-10 left-1/2 lg:-left-24 h-screen">
          <RenderModel>
              <Staff />
          </RenderModel>
      </div>
      
    </>
  );
}