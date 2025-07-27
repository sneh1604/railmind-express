// src/components/game/QuestionDisplay.jsx

import React, { useState, useEffect, useRef } from 'react';
import { FaBookmark, FaBrain, FaLightbulb, FaCogs, FaAtom } from 'react-icons/fa';

/**
 * Revolutionary holographic question display with neural network visualization
 * @param {object} props - The component props.
 * @param {object} props.question - The question object to display.
 * @param {string} props.question.topic - The category of the question.
 * @param {string} props.question.question - The text of the question.
 */
const QuestionDisplay = ({ question }) => {
  const [displayText, setDisplayText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [neuralNodes, setNeuralNodes] = useState([]);
  const canvasRef = useRef(null);

  // Generate neural network nodes for background
  useEffect(() => {
    const nodes = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * 400,
      y: Math.random() * 200,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      connections: []
    }));
    setNeuralNodes(nodes);
  }, [question]);

  // Animate neural network
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    let animationId;

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw nodes
      setNeuralNodes(prevNodes => {
        const updatedNodes = prevNodes.map(node => {
          // Update position
          node.x += node.vx;
          node.y += node.vy;
          
          // Bounce off edges
          if (node.x <= 0 || node.x >= canvas.width) node.vx *= -1;
          if (node.y <= 0 || node.y >= canvas.height) node.vy *= -1;
          
          return node;
        });

        // Draw connections between nearby nodes
        updatedNodes.forEach((node, i) => {
          updatedNodes.slice(i + 1).forEach(otherNode => {
            const distance = Math.sqrt(
              Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
            );
            if (distance < 80) {
              ctx.strokeStyle = `rgba(74, 144, 226, ${0.3 - distance / 300})`;
              ctx.lineWidth = 1;
              ctx.beginPath();
              ctx.moveTo(node.x, node.y);
              ctx.lineTo(otherNode.x, otherNode.y);
              ctx.stroke();
            }
          });
          
          // Draw node
          ctx.fillStyle = '#4A90E2';
          ctx.beginPath();
          ctx.arc(node.x, node.y, 3, 0, Math.PI * 2);
          ctx.fill();
        });

        return updatedNodes;
      });
      
      animationId = requestAnimationFrame(animate);
    };
    
    animate();
    return () => cancelAnimationFrame(animationId);
  }, []);

  // Enhanced typing effect with proper first letter display
  useEffect(() => {
    setDisplayText('');
    setIsTypingComplete(false);
    
    if (question?.question) {
      const text = question.question;
      let i = 0;
      
      // Start by immediately showing the first character
      setDisplayText(text.charAt(0));
      i = 1;
      
      const typingInterval = setInterval(() => {
        if (i <= text.length) {
          setDisplayText(text.substring(0, i));
          i++;
        } else {
          setIsTypingComplete(true);
          clearInterval(typingInterval);
        }
      }, 30);
      
      return () => clearInterval(typingInterval);
    }
  }, [question]);

  const getTopicIcon = (topic) => {
    const topicLower = topic?.toLowerCase() || '';
    if (topicLower.includes('math') || topicLower.includes('arithmetic') || topicLower.includes('algebra')) return FaCogs;
    if (topicLower.includes('science') || topicLower.includes('physics') || topicLower.includes('chemistry')) return FaAtom;
    if (topicLower.includes('geography') || topicLower.includes('history')) return FaLightbulb;
    return FaBrain;
  };

  const TopicIcon = getTopicIcon(question?.topic);

  if (!question) {
    return (
      <div className="holographic-loading">
        <div className="loading-orb"></div>
        <p>Initializing Neural Interface...</p>
      </div>
    );
  }

  return (
    <div className="holographic-question-container">
      {/* Neural Network Background */}
      <canvas 
        ref={canvasRef} 
        className="neural-canvas"
        width={400} 
        height={200}
      />
      
      {/* Holographic Border Effect */}
      <div className="holographic-border">
        <div className="corner-accent top-left"></div>
        <div className="corner-accent top-right"></div>
        <div className="corner-accent bottom-left"></div>
        <div className="corner-accent bottom-right"></div>
      </div>
      
      {/* Topic Display with Icon */}
      <div className="neural-topic-header">
        <div className="topic-icon-container">
          <TopicIcon className="topic-icon" />
          <div className="icon-energy-ring"></div>
        </div>
        <div className="topic-info">
          <span className="topic-label">NEURAL PATHWAY</span>
          <span className="topic-name">{question.topic}</span>
          <div className="topic-data-stream">
            <div className="data-bit"></div>
            <div className="data-bit"></div>
            <div className="data-bit"></div>
          </div>
        </div>
        <div className="difficulty-indicator">
          {Array.from({ length: question.difficulty || 1 }, (_, i) => (
            <div key={i} className="difficulty-dot active"></div>
          ))}
          {Array.from({ length: Math.max(0, 3 - (question.difficulty || 1)) }, (_, i) => (
            <div key={i} className="difficulty-dot"></div>
          ))}
        </div>
      </div>

      {/* Main Question Text */}
      <div className="question-content">
        <div className="holographic-text-container">
          <p className={`holographic-question-text ${isTypingComplete ? 'complete' : 'typing'}`}>
            {displayText}
            {!isTypingComplete && <span className="neural-cursor">▋</span>}
          </p>
        </div>
      </div>

      {/* Floating Particles */}
      <div className="floating-particles">
        {Array.from({ length: 8 }, (_, i) => (
          <div key={i} className={`particle particle-${i + 1}`}></div>
        ))}
      </div>
      
      {/* Data Stream Effect */}
      <div className="data-stream">
        <div className="stream-line"></div>
        <div className="stream-line delayed"></div>
      </div>
    </div>
  );
};

export default QuestionDisplay;