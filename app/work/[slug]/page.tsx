import { getProjectBySlug, getProjectNavigation, getAllProjectSlugs } from "@/data/projects";
import ProjectPageContent from "./project-page-content";

export async function generateStaticParams() {
  return getAllProjectSlugs().map((slug) => ({
    slug,
  }));
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
  const project = getProjectBySlug(params.slug);
  const navigation = getProjectNavigation(params.slug);

  if (!project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Project not found</h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The project you''re looking for doesn''t exist.
          </p>
          <a
            href="/work"
            className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Back to Work
          </a>
        </div>
      </div>
    );
  }

  return <ProjectPageContent project={project} navigation={navigation} />;
}
