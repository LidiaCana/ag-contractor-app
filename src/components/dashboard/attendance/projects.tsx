'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import ProjectService from '@/api/services/project';
import { CircularProgress } from '@mui/material';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import { DotsThreeVertical as DotsThreeVerticalIcon } from '@phosphor-icons/react/dist/ssr/DotsThreeVertical';

import type { ProjectFields, Record } from '@/types/api';

export function ListProjects(): React.JSX.Element {
  const [projects, setProjects] = useState<Record<ProjectFields>[] | []>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const router = useRouter();
  const getProjects = async (): Promise<void> => {
    setIsLoading(true);
    const data = await ProjectService.getProjects();
    setProjects(data);
    setIsLoading(false);
  };
  useEffect(() => {
    void getProjects();
  }, []);
  const handleProjectClick = (projectId: string) => {
    // Set redux project
    router.push(`/dashboard/attendance/form-attendance/${projectId}`);
  };
  return (
    <>
      {isLoading ? (
        <CircularProgress />
      ) : (
        <Card>
          <CardHeader title="Projects" />
          <Divider />

          <List>
            {projects.map((project, index) => (
              <ListItem
                button
                divider={index < projects.length - 1}
                key={project.id}
                onClick={() => {
                  handleProjectClick(project.id);
                }}
              >
                <ListItemText
                  primary={project.fields.name}
                  primaryTypographyProps={{ variant: 'subtitle1' }}
                  secondary={`Location ${project.fields.address}`}
                  secondaryTypographyProps={{ variant: 'body2' }}
                />
                <IconButton edge="end">
                  <DotsThreeVerticalIcon weight="bold" />
                </IconButton>
              </ListItem>
            ))}
          </List>

          <Divider />
        </Card>
      )}
    </>
  );
}
