import React, { useState } from 'react';
import {
  Box,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Typography,
  Collapse,
  IconButton,
  Chip,
  Stack,
  Divider
} from '@mui/material';
import { IconChevronDown, IconChevronUp, IconGitCommit } from '@tabler/icons-react';
import DiffViewer from 'components/DiffViewer';

const CommitHistory = ({ commits }) => {
  const [expandedCommit, setExpandedCommit] = useState(null);

  const handleExpandClick = (commitId) => {
    setExpandedCommit(expandedCommit === commitId ? null : commitId);
  };

  return (
    <Card>
      <CardHeader 
        title="Commit Geçmişi" 
        subheader={`Toplam ${commits?.length || 0} commit`}
      />
      <CardContent>
        <List sx={{ width: '100%' }}>
          {commits?.map((commit) => (
            <React.Fragment key={commit.id}>
              <ListItem
                alignItems="flex-start"
                secondaryAction={
                  <IconButton 
                    onClick={() => handleExpandClick(commit.id)}
                    size="small"
                  >
                    {expandedCommit === commit.id ? <IconChevronUp /> : <IconChevronDown />}
                  </IconButton>
                }
              >
                <ListItemAvatar>
                  <Avatar sx={{ bgcolor: 'primary.main' }}>
                    <IconGitCommit />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Typography variant="subtitle1" component="span">
                        {commit.message}
                      </Typography>
                      <Chip 
                        label={commit.branch}
                        size="small"
                        color="secondary"
                        variant="outlined"
                      />
                    </Stack>
                  }
                  secondary={
                    <Stack direction="row" spacing={2} sx={{ mt: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        {commit.author}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {new Date(commit.date).toLocaleString()}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {commit.hash.substring(0, 7)}
                      </Typography>
                    </Stack>
                  }
                />
              </ListItem>
              <Collapse in={expandedCommit === commit.id} timeout="auto" unmountOnExit>
                <Box sx={{ p: 2, bgcolor: 'background.default' }}>
                  <DiffViewer 
                    oldContent={commit.previousContent}
                    newContent={commit.currentContent}
                  />
                </Box>
              </Collapse>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      </CardContent>
    </Card>
  );
};

export default CommitHistory; 
