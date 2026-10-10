'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { getProjectById } from '@/lib/db/store';
import { Project } from '@/lib/db/types';
import { ProjectEditor } from '@/components/admin/ProjectEditor';

export default function EditProjectPage() {
  const params = useParams();
  const id = params?.id as string;
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      if (id) {
        const p = await getProjectById(id);
        setProject(p);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="w-8 h-8 rounded-full border-2 border-cyan-400 border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-8 text-center text-gray-400">
        <p>Project not found.</p>
      </div>
    );
  }

  return <ProjectEditor initialProject={project} isNew={false} />;
}
