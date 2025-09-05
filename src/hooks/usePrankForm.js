import { useState } from 'react';
import { validatePhoneNumber } from '../components/lib/utils/validation';
import { useFormPersistence } from './useFormPersistence';

const INITIAL_FORM_DATA = {
  targetName: '',
  phoneNumber: '',
  countryCode: 'uk',
  selectedVoice: 'voice_2982i2eghu3iy382yd_robot',
  message: ''
};

const COUNTRY_PREFIXES = {
  'uk': '44',
  'us': '1', 
  'es': '34'
};

export const usePrankForm = () => {
  const [formData, setFormData] = useState(INITIAL_FORM_DATA);
  const [playingVoice, setPlayingVoice] = useState(null);
  const [isLaunching, setIsLaunching] = useState(false);
  
  const { saveFormData, loadFormData, clearFormData } = useFormPersistence();

  const updateFormField = (field, value) => {
    const newFormData = { ...formData, [field]: value };
    setFormData(newFormData);
    
    // Save to localStorage whenever form data changes
    saveFormData(newFormData);
  };

  const updateCountry = (countryCode) => {
    const newFormData = { ...formData, countryCode };
    setFormData(newFormData);
    
    // Save to localStorage whenever form data changes
    saveFormData(newFormData);
  };
  
  const previewVoice = (voiceId) => {
    setPlayingVoice(voiceId);
    setTimeout(() => setPlayingVoice(null), 2000);
  };

  const launchPrank = (onComplete) => {
    // Validate form
    if (!formData.targetName.trim() || !formData.phoneNumber.trim() || !formData.message.trim()) {
      alert('Please fill in all fields to start the prank! 🎭');
      return;
    }
    
    if (!validatePhoneNumber(formData.phoneNumber)) {
      alert('Please enter a valid phone number! 📞');
      return;
    }
    
    // Format complete phone number
    const countryPrefix = COUNTRY_PREFIXES[formData.countryCode] || '44';
    const cleanPhoneNumber = formData.phoneNumber.replace(/[^0-9]/g, '');
    const completePhoneNumber = `${countryPrefix}${cleanPhoneNumber}`;
    
    console.log('Launching prank call:', {
      ...formData,
      completePhoneNumber
    });
    
    setIsLaunching(true);
    
    // Simulate prank call process
    setTimeout(() => {
      setIsLaunching(false);
      
      // Clear form data after successful launch
      clearFormData();
      
      onComplete?.();
    }, 3000);
  };

  // Function to restore form data from localStorage
  const restoreFormData = () => {
    const savedData = loadFormData();
    if (savedData) {
      setFormData(savedData);
      console.log('Form data restored:', savedData);
      return true;
    }
    return false;
  };

  return {
    formData,
    playingVoice,
    isLaunching,
    updateFormField,
    updateCountry,
    previewVoice,
    launchPrank,
    restoreFormData,
    clearFormData,
  };
};