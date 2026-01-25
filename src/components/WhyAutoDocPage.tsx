// WhyAutoDocPage.tsx 
import React, { useState } from 'react'; 
import { useNavigate } from 'react-router-dom'; 
 
function WhyAutoDocPage() { 
  const [isDarkTheme, setIsDarkTheme] = useState(false); 
  const navigate = useNavigate(); 
  return ( 
    <div>Why AutoDoc Page - Working</div> 
  ); 
} 
 
export default WhyAutoDocPage;