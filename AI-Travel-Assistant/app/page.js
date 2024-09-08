'use client';

import { Box, Button, Stack, TextField, Typography, IconButton, ThemeProvider, createTheme } from '@mui/material';
import { Send, DarkMode, LightMode } from '@mui/icons-material';
import { useState, useRef, useEffect } from 'react';

// Light and Dark theme configurations
const getTheme = (mode) => createTheme({
  palette: {
    mode: mode,
    primary: {
      main: mode === 'light' ? '#29b6f6' : '#90caf9', // Light Blue in light mode, lighter blue for dark mode
    },
    secondary: {
      main: mode === 'light' ? '#03dac6' : '#80cbc4', // Cyan in light mode, softer cyan for dark mode
    },
    background: {
      default: mode === 'light' ? '#e3f2fd' : '#1c1c1c', // Lighter background for light mode, darker background for dark mode
    },
  },
  typography: {
    fontFamily: 'Poppins, sans-serif', // Custom Google Font
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: '12px',
          textTransform: 'none',
        },
      },
    },
  },
});

export default function Home() {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hi! I'm your travel assistant. I'll help you make sure you're fully prepared for your trip. From packing to documents, I'll guide you every step of the way. Ready to get started?",
    },
  ]);
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [darkMode, setDarkMode] = useState(false); // State for dark mode

  const theme = getTheme(darkMode ? 'dark' : 'light'); // Use dark or light theme based on state

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev); // Toggle dark mode
  };

  const sendMessage = async () => {
    if (!message.trim() || isLoading) return;
    setIsLoading(true);
    setIsTyping(true);

    const newMessage = { role: 'user', content: message };
    setMessages((prevMessages) => [...prevMessages, newMessage]);
    setMessage('');

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify([...messages, newMessage]),
      });

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: '' },
      ]);

      let assistantMessage = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        const chunkText = decoder.decode(value, { stream: true });
        assistantMessage += chunkText;

        setMessages((prevMessages) =>
          prevMessages.map((msg, index) =>
            index === prevMessages.length - 1 && msg.role === 'assistant'
              ? { ...msg, content: assistantMessage }
              : msg
          )
        );
      }
    } catch (error) {
      console.error('Error:', error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'assistant', content: "I'm sorry, but I encountered an error. Please try again later." },
      ]);
    }

    setIsLoading(false);
    setIsTyping(false);
  };

  const handleKeyPress = (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      sendMessage();
    }
  };

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <ThemeProvider theme={theme}>
      <Box
        sx={{
          width: '100vw',
          height: '100vh',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          background: theme.palette.background.default, // Background color changes with theme
        }}
      >
        {/* Header with logo and title */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '600px',
            p: 2,
            backgroundColor: 'primary.main',
            color: 'white',
            textAlign: 'center',
            borderRadius: '12px 12px 0 0',
            boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography variant="h5" fontWeight="bold">
            <img src="https://i.ibb.co/QCxrxfy/logo.png" alt="Logo" style={{ width: '40px', marginRight: '10px', verticalAlign: 'middle' }} />
            Ready to Go?
          </Typography>

          {/* Dark mode toggle switch */}
          <IconButton onClick={toggleDarkMode} color="inherit">
            {darkMode ? <LightMode /> : <DarkMode />} {/* Change icon based on theme */}
          </IconButton>
        </Box>

        {/* Main chat container */}
        <Stack
          direction="column"
          width="100%"
          maxWidth="600px"
          height="70vh"
          bgcolor={theme.palette.mode === 'light' ? 'white' : '#333'} // Background for messages
          boxShadow="0px 8px 24px rgba(0, 0, 0, 0.15)"
          borderRadius={4}
          p={3}
          spacing={3}
        >
          <Stack
            direction="column"
            spacing={2}
            flexGrow={1}
            overflow="auto"
            sx={{
              padding: 2,
              borderRadius: '8px',
              boxShadow: 'inset 0px 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            {messages.map((message, index) => (
              <Box
                key={index}
                display="flex"
                justifyContent={
                  message.role === 'assistant' ? 'flex-start' : 'flex-end'
                }
              >
                <Box
                  sx={{
                    backgroundColor:
                      darkMode 
                        ? (message.role === 'assistant' ? '#424242' : '#616161') // Shades of gray for dark mode
                        : (message.role === 'assistant' ? 'primary.main' : 'secondary.main'),
                    color: 'white',
                    borderRadius: '16px',
                    p: 2,
                    maxWidth: '75%',
                    wordWrap: 'break-word',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    transition: 'transform 0.2s',
                    '&:hover': {
                      transform: 'scale(1.05)',
                    },
                  }}
                >
                  {message.content}
                </Box>
              </Box>
            ))}
            {isTyping && (
              <Box display="flex" justifyContent="flex-start">
                <Box
                  sx={{
                    backgroundColor: darkMode ? '#424242' : 'primary.main', // Adjust typing box color in dark mode
                    color: 'white',
                    borderRadius: '16px',
                    p: 2,
                    maxWidth: '75%',
                    wordWrap: 'break-word',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                    fontStyle: 'italic',
                  }}
                >
                  Typing...
                </Box>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Stack>

          <Stack direction="row" spacing={2}>
            <TextField
              label="Type a message..."
              fullWidth
              variant="outlined"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={isLoading}
              sx={{
                '& .MuiOutlinedInput-root': {
                  borderRadius: '12px',
                },
              }}
            />
            <Button
              variant="contained"
              onClick={sendMessage}
              disabled={isLoading}
              sx={{
                width: '56px',
                height: '56px',
                background: 'linear-gradient(135deg, #1e88e5, #29b6f6)',
                color: 'white',
                boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #1e88e5, #0288d1)',
                },
              }}
            >
              {isLoading ? '...' : <Send />} {/* Icon for send button */}
            </Button>
          </Stack>
        </Stack>

        {/* Footer with reserved rights */}
        <Box
          sx={{
            width: '100%',
            maxWidth: '600px',
            p: 2,
            textAlign: 'center',
            mt: 2,
            color: '#555',
          }}
        >
          <Typography variant="body2">
            © 2024 Ready to Go. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </ThemeProvider>
  );
}

