import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './components/ui/card';
import { Button } from './components/ui/button';
import { Input } from './components/ui/input';
import { Label } from './components/ui/label';
import { Textarea } from './components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './components/ui/select';
import { Badge } from './components/ui/badge';
import { Separator } from './components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './components/ui/tabs';
import { Progress } from './components/ui/progress';
import { 
  Target, 
  Users, 
  Lightbulb, 
  MessageSquare, 
  Palette, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle, 
  Loader2,
  Upload,
  X
} from 'lucide-react';
import aiService from './services/aiService';
import './App.css';

function App() {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    campaignGoal: '',
    companyName: '',
    businessDescription: '',
    audienceDescription: '',
    budget: '',
    targetAreas: '',
    selectedMessagingAngle: null,
    selectedVisualTheme: null,
    companyLogo: null,
    logoPreview: null
  });

  const [aiResults, setAiResults] = useState({
    recommendations: null,
    messaging: null,
    persona: null,
    creativeBrief: null
  });

  const handleMessagingAngleSelect = (angle) => {
    setFormData(prev => ({ ...prev, selectedMessagingAngle: angle }));
  };

  const handleVisualThemeSelect = (theme) => {
    setFormData(prev => ({ ...prev, selectedVisualTheme: theme }));
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleLogoUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please upload an image file');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          companyLogo: file,
          logoPreview: e.target.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removeLogo = () => {
    setFormData(prev => ({
      ...prev,
      companyLogo: null,
      logoPreview: null
    }));
  };

  const generateRecommendations = async () => {
    setIsLoading(true);
    
    try {
      const campaignData = {
        campaignGoal: formData.campaignGoal,
        companyName: formData.companyName,
        businessDescription: formData.businessDescription,
        audienceDescription: formData.audienceDescription,
        budget: formData.budget,
        targetAreas: formData.targetAreas
      };

      const [channels, tactics, persona] = await Promise.all([
        aiService.generateChannelRecommendations(campaignData),
        aiService.generateTacticRecommendations(campaignData),
        aiService.generateAudiencePersona(campaignData)
      ]);

      // Generate media publications based on persona
      const mediaPublications = await aiService.generateMediaPublicationRecommendations(campaignData, persona);

      const recommendations = {
        channels: channels,
        tactics: tactics,
        mediaPublications: mediaPublications
      };
      
      setAiResults(prev => ({
        ...prev,
        recommendations: recommendations
      }));
      
      setIsLoading(false);
      setCurrentStep(4);
    } catch (error) {
      console.error('Error generating recommendations:', error);
      setIsLoading(false);
    }
  };

  const generateMessaging = async () => {
    setIsLoading(true);
    
    try {
      const campaignData = {
        campaignGoal: formData.campaignGoal,
        companyName: formData.companyName,
        businessDescription: formData.businessDescription,
        audienceDescription: formData.audienceDescription,
        budget: formData.budget,
        targetAreas: formData.targetAreas
      };

      const persona = await aiService.generateAudiencePersona(campaignData);
      const messagingAngles = await aiService.generateMessagingAngles(campaignData, persona);
      const visualThemes = await aiService.generateVisualThemes(campaignData, persona, messagingAngles);
      
      setAiResults(prev => ({
        ...prev,
        messaging: {
          persona: persona,
          messagingAngles: messagingAngles,
          visualThemes: visualThemes
        }
      }));
      
      setIsLoading(false);
      setCurrentStep(5);
    } catch (error) {
      console.error('Error generating messaging:', error);
      setIsLoading(false);
    }
  };

  const generateCreativeBrief = async () => {
    setIsLoading(true);
    
    try {
      const campaignData = {
        campaignGoal: formData.campaignGoal,
        companyName: formData.companyName,
        businessDescription: formData.businessDescription,
        audienceDescription: formData.audienceDescription,
        budget: formData.budget,
        targetAreas: formData.targetAreas
      };

      const briefContent = await aiService.generateCreativeBrief(campaignData, aiResults);
      
      setAiResults(prev => ({
        ...prev,
        creativeBrief: briefContent
      }));
      
      setIsLoading(false);
    } catch (error) {
      console.error('Error generating creative brief:', error);
      setIsLoading(false);
    }
  };

  const downloadCreativeBrief = () => {
    if (!aiResults.creativeBrief) return;
    
    const blob = new Blob([aiResults.creativeBrief], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${formData.companyName || 'Campaign'}_Creative_Brief.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const nextStep = () => {
    if (currentStep === 3) {
      generateRecommendations();
    } else if (currentStep === 4) {
      generateMessaging();
    } else if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const generateCreativeVisuals = async () => {
    if (!formData.selectedMessagingAngle || !formData.selectedVisualTheme) {
      alert('Please select both a messaging angle and visual theme first.');
      return;
    }

    setIsLoading(true);
    
    try {
      const campaignData = {
        campaignGoal: formData.campaignGoal,
        companyName: formData.companyName,
        businessDescription: formData.businessDescription,
        audienceDescription: formData.audienceDescription,
        budget: formData.budget,
        targetAreas: formData.targetAreas
      };

      const creativeVisuals = await aiService.generateCreativeVisual(
        formData.selectedMessagingAngle,
        formData.selectedVisualTheme,
        formData.companyName,
        formData.businessDescription,
        formData.campaignGoal,
        formData.audienceDescription,
        aiResults.messaging.persona
      );
      
      setAiResults(prev => ({
        ...prev,
        creativeVisuals: creativeVisuals
      }));
      
      setIsLoading(false);
      setCurrentStep(6);
    } catch (error) {
      console.error('Error generating creative visuals:', error);
      setIsLoading(false);
    }
  };

  const isStep1Valid = () => {
    return formData.campaignGoal && formData.companyName && formData.businessDescription && 
           formData.budget && formData.targetAreas;
  };

  const isStep2Valid = () => {
    return formData.audienceDescription;
  };

  const renderProgressBar = () => {
    const progress = (currentStep / 6) * 100;
    return (
      <div className="w-full max-w-4xl mx-auto mb-8">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium">Step {currentStep} of 6</span>
          <span className="text-sm text-muted-foreground">{Math.round(progress)}% Complete</span>
        </div>
        <Progress value={progress} className="w-full" />
      </div>
    );
  };

  const renderStep1 = () => (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5" />
          Define Your Campaign
        </CardTitle>
        <CardDescription>
          Tell us about your business and campaign objectives
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="campaignGoal">Campaign Goal *</Label>
            <Select value={formData.campaignGoal} onValueChange={(value) => handleInputChange('campaignGoal', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select your primary goal" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Generate more leads">Generate more leads</SelectItem>
                <SelectItem value="Increase brand awareness">Increase brand awareness</SelectItem>
                <SelectItem value="Drive sales growth">Drive sales growth</SelectItem>
                <SelectItem value="Launch new product">Launch new product</SelectItem>
                <SelectItem value="Enter new market">Enter new market</SelectItem>
                <SelectItem value="Improve customer retention">Improve customer retention</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="companyName">Company Name *</Label>
            <Input
              id="companyName"
              placeholder="Your company name"
              value={formData.companyName}
              onChange={(e) => handleInputChange('companyName', e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="businessDescription">Business Description *</Label>
          <Textarea
            id="businessDescription"
            placeholder="Describe your business, products/services, and what makes you unique..."
            value={formData.businessDescription}
            onChange={(e) => handleInputChange('businessDescription', e.target.value)}
            rows={3}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="budget">Monthly Marketing Budget (£) *</Label>
            <Select value={formData.budget} onValueChange={(value) => handleInputChange('budget', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select budget range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1000">£1,000 - £2,500</SelectItem>
                <SelectItem value="2500">£2,500 - £5,000</SelectItem>
                <SelectItem value="5000">£5,000 - £10,000</SelectItem>
                <SelectItem value="10000">£10,000 - £25,000</SelectItem>
                <SelectItem value="25000">£25,000+</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="targetAreas">Target Geographic Areas *</Label>
            <Input
              id="targetAreas"
              placeholder="e.g., UK, London, Europe, Global"
              value={formData.targetAreas}
              onChange={(e) => handleInputChange('targetAreas', e.target.value)}
            />
          </div>
        </div>

        {/* Logo Upload Section */}
        <div className="space-y-4">
          <Label>Company Logo (Optional)</Label>
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
            {!formData.logoPreview ? (
              <div className="text-center">
                <Upload className="mx-auto h-12 w-12 text-gray-400" />
                <div className="mt-4">
                  <label htmlFor="logo-upload" className="cursor-pointer">
                    <span className="mt-2 block text-sm font-medium text-gray-900">
                      Upload your company logo
                    </span>
                    <span className="mt-1 block text-sm text-gray-500">
                      PNG, JPG, GIF up to 5MB
                    </span>
                  </label>
                  <input
                    id="logo-upload"
                    name="logo-upload"
                    type="file"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleLogoUpload}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={() => document.getElementById('logo-upload').click()}
                >
                  Choose File
                </Button>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <img
                    src={formData.logoPreview}
                    alt="Logo preview"
                    className="h-16 w-16 object-contain rounded"
                  />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Logo uploaded</p>
                    <p className="text-sm text-gray-500">
                      {formData.companyLogo?.name}
                    </p>
                  </div>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={removeLogo}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Define Your Target Audience
        </CardTitle>
        <CardDescription>
          Describe your ideal customers in detail
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="audienceDescription">Target Audience Description *</Label>
          <Textarea
            id="audienceDescription"
            placeholder="Describe your ideal customers - their roles, challenges, demographics, and behaviors..."
            value={formData.audienceDescription}
            onChange={(e) => handleInputChange('audienceDescription', e.target.value)}
            rows={4}
          />
        </div>

        <div className="bg-blue-50 p-4 rounded-lg">
          <h3 className="font-semibold text-blue-900 mb-2">💡 Audience Description Tips</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• Include specific job titles and company sizes</li>
            <li>• Mention their main challenges and pain points</li>
            <li>• Describe their preferred communication channels</li>
            <li>• Add any relevant demographics (age, location, industry)</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Users className="w-5 h-5" />
          Campaign Setup Tips
        </CardTitle>
        <CardDescription>
          Best practices for effective campaign targeting
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">🎯 Ready to Generate Recommendations</h3>
            <p className="text-sm text-green-800">
              Based on your campaign goal, business description, and target audience, our AI will generate personalized channel recommendations, tactical suggestions, and media publication options.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep4 = () => (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="w-5 h-5" />
          AI-Generated Recommendations
        </CardTitle>
        <CardDescription>
          Based on your campaign goal and target audience, here are our AI-powered suggestions
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Analyzing your campaign requirements...</p>
              <p className="text-sm text-muted-foreground mt-2">This may take a few moments</p>
            </div>
          </div>
        ) : aiResults.recommendations ? (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">🎯 Recommended Channels</h3>
              <div className="grid gap-4">
                {aiResults.recommendations.channels.map((channel, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-lg">{channel.name}</h4>
                      <Badge variant="secondary">{channel.confidence}% match</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">{channel.reason}</p>
                    {channel.budgetAllocation && (
                      <div className="bg-blue-50 p-3 rounded-md">
                        <p className="text-sm font-medium text-blue-900">💰 Budget Allocation</p>
                        <p className="text-sm text-blue-700">{channel.budgetAllocation}</p>
                      </div>
                    )}
                    {channel.audienceInsight && (
                      <div className="bg-green-50 p-3 rounded-md">
                        <p className="text-sm font-medium text-green-900">🎯 Audience Insight</p>
                        <p className="text-sm text-green-700">{channel.audienceInsight}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-4">📰 Recommended Media Publications</h3>
              <div className="grid gap-4">
                {aiResults.recommendations.mediaPublications?.map((publication, index) => (
                  <div key={index} className="border rounded-lg p-4 space-y-2">
                    <h4 className="font-medium text-lg">{publication.name}</h4>
                    <p className="text-sm text-muted-foreground">{publication.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-4">📋 Creative Brief for Agency</h3>
              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground mb-3">
                  Generate a comprehensive creative brief document that you can share with your agency or creative team.
                </p>
                <Button 
                  onClick={generateCreativeBrief} 
                  disabled={isLoading || !aiResults.messaging}
                  variant="outline"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Generating Brief...
                    </>
                  ) : (
                    'Generate Creative Brief'
                  )}
                </Button>
                {aiResults.creativeBrief && (
                  <div className="mt-4">
                    <Button 
                      onClick={downloadCreativeBrief}
                      variant="default"
                      size="sm"
                    >
                      Download Brief as Markdown
                    </Button>
                  </div>
                )}
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-4">⚡ Recommended Tactics</h3>
              <div className="grid gap-3">
                {aiResults.recommendations.tactics.map((tactic, index) => (
                  <div key={index} className="flex items-start gap-3 p-3 bg-muted rounded-lg">
                    <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-medium mt-0.5">
                      {index + 1}
                    </div>
                    <p className="text-sm">{tactic}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );

  const renderStep5 = () => (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="w-5 h-5" />
          Messaging & Creative Suggestions
        </CardTitle>
        <CardDescription>
          Generate personalized messaging and creative direction for your campaign
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!aiResults.messaging ? (
          <div className="text-center py-8">
            <Button onClick={generateMessaging} disabled={isLoading} size="lg">
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Generating Creative Ideas...
                </>
              ) : (
                'Generate Messaging & Creative Direction'
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Audience Persona */}
            <div>
              <h3 className="text-lg font-semibold mb-4">👤 Your Target Persona</h3>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-lg text-blue-900">{aiResults.messaging.persona.name}</h4>
                    <p className="text-blue-700 mb-4">{aiResults.messaging.persona.role} • {aiResults.messaging.persona.age}</p>
                    
                    <div className="space-y-3">
                      <div>
                        <h5 className="font-medium text-blue-900">🎯 Motivations</h5>
                        <ul className="text-sm text-blue-700 mt-1">
                          {aiResults.messaging.persona.motivations.map((motivation, index) => (
                            <li key={index}>• {motivation}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-medium text-blue-900">😰 Pain Points</h5>
                      <ul className="text-sm text-blue-700 mt-1">
                        {aiResults.messaging.persona.painPoints.map((pain, index) => (
                          <li key={index}>• {pain}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h5 className="font-medium text-blue-900">📱 Preferred Channels</h5>
                      <ul className="text-sm text-blue-700 mt-1">
                        {aiResults.messaging.persona.preferredChannels.map((channel, index) => (
                          <li key={index}>• {channel}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Messaging Angles */}
            <div>
              <h3 className="text-lg font-semibold mb-4">💬 Messaging Angles</h3>
              <p className="text-muted-foreground mb-4">Choose the messaging approach that best fits your campaign:</p>
              <div className="grid gap-4">
                {aiResults.messaging.messagingAngles.map((angle, index) => (
                  <div 
                    key={index} 
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      formData.selectedMessagingAngle?.angle === angle.angle 
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => handleMessagingAngleSelect(angle)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-lg">{angle.angle}</h4>
                      {formData.selectedMessagingAngle?.angle === angle.angle && (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <p className="text-xl font-medium mb-2">"{angle.headline}"</p>
                    <p className="text-sm text-muted-foreground mb-2">{angle.description}</p>
                    <div className="flex items-center gap-4 text-sm">
                      <Badge variant="outline">{angle.tone}</Badge>
                      <span className="text-primary font-medium">CTA: {angle.cta}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Visual Themes */}
            <div>
              <h3 className="text-lg font-semibold mb-4">🎨 Visual Themes</h3>
              <p className="text-muted-foreground mb-4">Select the visual style that aligns with your brand:</p>
              <div className="grid gap-4">
                {aiResults.messaging.visualThemes.map((theme, index) => (
                  <div 
                    key={index} 
                    className={`border rounded-lg p-4 cursor-pointer transition-all ${
                      formData.selectedVisualTheme?.theme === theme.theme 
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                        : 'hover:border-primary/50'
                    }`}
                    onClick={() => handleVisualThemeSelect(theme)}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-lg">{theme.theme}</h4>
                      {formData.selectedVisualTheme?.theme === theme.theme && (
                        <CheckCircle className="w-5 h-5 text-primary" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{theme.description}</p>
                    <Badge variant="secondary">{theme.mood}</Badge>
                  </div>
                ))}
              </div>
            </div>

            {/* Generate Creative Visuals Button */}
            {formData.selectedMessagingAngle && formData.selectedVisualTheme && (
              <div className="text-center py-6">
                <Button onClick={generateCreativeVisuals} disabled={isLoading} size="lg">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Generating Creative Concepts...
                    </>
                  ) : (
                    'Generate Creative Concepts'
                  )}
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderStep6 = () => (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Palette className="w-5 h-5" />
          Creative Concepts
        </CardTitle>
        <CardDescription>
          AI-generated creative concepts based on your selected messaging and visual theme
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground">Creating your custom creative concepts...</p>
              <p className="text-sm text-muted-foreground mt-2">This may take up to 30 seconds</p>
            </div>
          </div>
        ) : aiResults.creativeVisuals ? (
          <div className="space-y-8">
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border">
              <h3 className="font-semibold text-green-900 mb-2">🎉 Your Creative Strategy is Ready!</h3>
              <p className="text-green-700">
                Based on your selected messaging angle "<strong>{formData.selectedMessagingAngle?.angle}</strong>" 
                and "<strong>{formData.selectedVisualTheme?.theme}</strong>" visual theme, here are three distinct creative concepts:
              </p>
            </div>

            <div className="grid gap-8">
              {aiResults.creativeVisuals.map((creative, index) => (
                <div key={creative.id} className="border rounded-lg overflow-hidden">
                  <div className="grid grid-cols-1 lg:grid-cols-2">
                    {/* Creative Preview */}
                    <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex items-center justify-center min-h-[400px]">
                      <div 
                        className="w-full max-w-sm bg-white rounded-lg shadow-lg overflow-hidden"
                        style={{
                          backgroundImage: `url(${creative.imageUrl})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center'
                        }}
                      >
                        <div className="bg-black bg-opacity-50 p-6 text-white">
                          <h3 className="text-2xl font-bold mb-3">{creative.headline}</h3>
                          <p className="text-sm mb-4 opacity-90">{creative.subCopy}</p>
                          <button className="bg-white text-black px-4 py-2 rounded font-medium text-sm">
                            {creative.cta}
                          </button>
                          
                          {/* Logo Display */}
                          {formData.logoPreview ? (
                            <div className="absolute bottom-4 right-4 bg-white p-2 rounded shadow-md">
                              <img 
                                src={formData.logoPreview} 
                                alt="Company Logo" 
                                className="h-8 w-auto object-contain"
                              />
                            </div>
                          ) : formData.companyName ? (
                            <div className="absolute bottom-4 right-4 bg-white text-black p-2 rounded shadow-md">
                              <span className="text-lg font-bold">
                                {formData.companyName.charAt(0)}
                              </span>
                            </div>
                          ) : null}
                        </div>
                      </div>
                    </div>

                    {/* Creative Details */}
                    <div className="p-6 space-y-4">
                      <div>
                        <h4 className="text-xl font-semibold mb-2">{creative.title}</h4>
                        <Badge variant="outline" className="mb-3">{creative.approach}</Badge>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <h5 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Headline</h5>
                          <p className="font-medium">{creative.headline}</p>
                        </div>

                        <div>
                          <h5 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Supporting Copy</h5>
                          <p className="text-sm">{creative.subCopy}</p>
                        </div>

                        <div>
                          <h5 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Call to Action</h5>
                          <p className="text-sm font-medium text-primary">{creative.cta}</p>
                        </div>

                        <div>
                          <h5 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Creative Narrative</h5>
                          <p className="text-sm">{creative.narrative}</p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 pt-2">
                          <div>
                            <h5 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Visual Style</h5>
                            <p className="text-sm">{creative.visualStyle}</p>
                          </div>
                          <div>
                            <h5 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">Layout Approach</h5>
                            <p className="text-sm">{creative.layout}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-blue-50 p-6 rounded-lg">
              <h3 className="font-semibold text-blue-900 mb-2">🚀 Next Steps</h3>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>• Use these concepts as starting points for your creative team</li>
                <li>• Test different variations with your target audience</li>
                <li>• Adapt the messaging for different channels and formats</li>
                <li>• Consider A/B testing headlines and calls-to-action</li>
                <li>• Download the creative brief to share with your agency</li>
              </ul>
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-muted-foreground">Complete the previous steps to generate creative concepts</p>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const renderNavigation = () => (
    <div className="flex justify-between items-center w-full max-w-4xl mx-auto mt-8">
      <Button 
        variant="outline" 
        onClick={prevStep} 
        disabled={currentStep === 1}
        className="flex items-center gap-2"
      >
        <ArrowLeft className="w-4 h-4" />
        Previous
      </Button>
      
      <div className="flex gap-2">
        {[1, 2, 3, 4, 5, 6].map((step) => (
          <div
            key={step}
            className={`w-3 h-3 rounded-full ${
              step === currentStep 
                ? 'bg-primary' 
                : step < currentStep 
                  ? 'bg-primary/60' 
                  : 'bg-muted'
            }`}
          />
        ))}
      </div>

      <Button 
        onClick={nextStep} 
        disabled={
          (currentStep === 1 && !isStep1Valid()) || 
          (currentStep === 2 && !isStep2Valid()) ||
          (currentStep === 4 && !aiResults.recommendations) ||
          (currentStep === 5 && !aiResults.messaging) ||
          currentStep === 6 ||
          isLoading
        }
        className="flex items-center gap-2"
      >
        {currentStep === 3 ? 'Generate Recommendations' : 
         currentStep === 4 ? 'Generate Messaging' : 'Next'}
        <ArrowRight className="w-4 h-4" />
      </Button>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Campaign Strategy AI
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Generate data-driven marketing strategies, personalized messaging, and creative concepts powered by AI
          </p>
        </div>

        {/* Progress Bar */}
        {renderProgressBar()}

        {/* Step Content */}
        <div className="mb-8">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
          {currentStep === 4 && renderStep4()}
          {currentStep === 5 && renderStep5()}
          {currentStep === 6 && renderStep6()}
        </div>

        {/* Navigation */}
        {renderNavigation()}
      </div>
    </div>
  );
}

export default App;

