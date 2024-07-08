import { EditProjectForm } from '@/app/projects/[projectId]/components/EditProjectForm/EditProjectForm'
import { prisma } from '@/prisma/prisma'
import { notFound } from 'next/navigation'
import Header from '@/app/components/Header';

export default async function Page({
  params,
}: {
  params: { projectId: string }
}) {
  const id = parseInt(params.projectId)

  const project = await prisma.project.findUnique({
    where: { id },
  })

  if (!project) {
    return notFound()
  }

  return (
    <>
      <Header projectTitle={project.title} />
      <EditProjectForm project={project} />
    </>
  )
}
