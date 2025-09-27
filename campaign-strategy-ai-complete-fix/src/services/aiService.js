// Static AI Service with pre-generated responses
// This version works without any API calls and provides realistic demo data

class AIServiceStatic {
  constructor() {
    this.isStatic = true;
  }

  // Simulate API delay for realistic UX
  async delay(ms = 1500) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async callOpenAI(messages, temperature = 0.7, maxTokens = 1500) {
    await this.delay();
    return "Static response generated for demo purposes.";
  }

  async callOpenAIImageGeneration(prompt, size = '1024x1024') {
    await this.delay(2000);
    
    // Return different placeholder images based on prompt content
    if (prompt.includes('professional') || prompt.includes('business')) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMzYjgyZjYiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMxZDRlZDgiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5Qcm9mZXNzaW9uYWwgQ3JlYXRpdmU8L3RleHQ+PHRleHQgeD0iNTAlIiB5PSI2MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxMiIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIG9wYWNpdHk9IjAuOSI+QUktR2VuZXJhdGVkIFZpc3VhbDwvdGV4dD48L3N2Zz4=';
    } else if (prompt.includes('creative') || prompt.includes('colorful')) {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiNmZjZkMDAiLz48c3RvcCBvZmZzZXQ9IjUwJSIgc3RvcC1jb2xvcj0iI2ZmMDA4NSIvPjxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iIzgwMDBmZiIvPjwvbGluZWFyR3JhZGllbnQ+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZykiLz48dGV4dCB4PSI1MCUiIHk9IjQ1JSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjE4IiBmb250LXdlaWdodD0iYm9sZCIgZmlsbD0id2hpdGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkNyZWF0aXZlIFZpc3VhbDwvdGV4dD48dGV4dCB4PSI1MCUiIHk9IjYwJSIgZm9udC1mYW1pbHk9IkFyaWFsLCBzYW5zLXNlcmlmIiBmb250LXNpemU9IjEyIiBmaWxsPSJ3aGl0ZSIgdGV4dC1hbmNob3I9Im1pZGRsZSIgb3BhY2l0eT0iMC45Ij5EeW5hbWljIERlc2lnbjwvdGV4dD48L3N2Zz4=';
    } else {
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48bGluZWFyR3JhZGllbnQgaWQ9ImciIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPjxzdG9wIG9mZnNldD0iMCUiIHN0b3AtY29sb3I9IiMxMGI5ODEiLz48c3RvcCBvZmZzZXQ9IjEwMCUiIHN0b3AtY29sb3I9IiMwNTk2NjkiLz48L2xpbmVhckdyYWRpZW50PjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2cpIi8+PHRleHQgeD0iNTAlIiB5PSI0NSUiIGZvbnQtZmFtaWx5PSJBcmlhbCwgc2Fucy1zZXJpZiIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5TdHJhdGVnaWMgVmlzdWFsPC90ZXh0Pjx0ZXh0IHg9IjUwJSIgeT0iNjAlIiBmb250LWZhbWlseT0iQXJpYWwsIHNhbnMtc2VyaWYiIGZvbnQtc2l6ZT0iMTIiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBvcGFjaXR5PSIwLjkiPkNhbXBhaWduIEZvY3VzZWQ8L3RleHQ+PC9zdmc+';
    }
  }

  async generateChannelRecommendations(campaignData) {
    await this.delay();
    
    const { campaignGoal, businessDescription, audienceDescription, budget } = campaignData;
    const budgetNum = parseInt(budget) || 5000;
    
    // Generate contextual recommendations based on input
    const recommendations = [];
    
    if (audienceDescription.toLowerCase().includes('b2b') || businessDescription.toLowerCase().includes('business')) {
      recommendations.push({
        channel: 'LinkedIn Ads',
        confidence: 88,
        reasoning: 'Perfect for B2B targeting with professional audience reach and detailed targeting options',
        budget_allocation: 35,
        expected_cpm: '$8-12',
        expected_ctr: '0.8-1.2%'
      });
    }
    
    if (campaignGoal.includes('leads') || campaignGoal.includes('sales')) {
      recommendations.push({
        channel: 'Google Search Ads',
        confidence: 85,
        reasoning: 'High-intent users actively searching for solutions, excellent for lead generation',
        budget_allocation: 30,
        expected_cpm: '$15-25',
        expected_ctr: '2.5-4.0%'
      });
    }
    
    if (budgetNum >= 5000) {
      recommendations.push({
        channel: 'Facebook/Instagram Ads',
        confidence: 78,
        reasoning: 'Broad reach with sophisticated targeting options, great for brand awareness',
        budget_allocation: 25,
        expected_cpm: '$5-8',
        expected_ctr: '1.0-1.5%'
      });
    }
    
    recommendations.push({
      channel: 'Content Marketing',
      confidence: 72,
      reasoning: 'Builds long-term authority and organic reach, cost-effective for sustained growth',
      budget_allocation: 10,
      expected_cpm: '$2-4',
      expected_ctr: '3.0-5.0%'
    });
    
    return recommendations.slice(0, 4); // Return top 4 recommendations
  }

  async generateTacticRecommendations(campaignData) {
    await this.delay();
    
    const tactics = [
      {
        tactic: 'Retargeting Campaign',
        confidence: 82,
        reasoning: 'Re-engage website visitors who showed interest but didn\'t convert',
        implementation: 'Set up pixel tracking and create custom audiences',
        timeline: '1-2 weeks'
      },
      {
        tactic: 'A/B Testing Program',
        confidence: 79,
        reasoning: 'Optimize ad performance through systematic testing of creative elements',
        implementation: 'Test headlines, images, and call-to-action buttons',
        timeline: '2-4 weeks'
      },
      {
        tactic: 'Lookalike Audiences',
        confidence: 76,
        reasoning: 'Find new customers similar to your best existing customers',
        implementation: 'Upload customer data to create lookalike segments',
        timeline: '1 week'
      },
      {
        tactic: 'Video Content Strategy',
        confidence: 74,
        reasoning: 'Video content typically achieves higher engagement rates',
        implementation: 'Create short-form videos for social media platforms',
        timeline: '3-4 weeks'
      }
    ];
    
    return tactics;
  }

  async generateAudiencePersona(campaignData) {
    await this.delay();
    
    const { audienceDescription, businessDescription, campaignGoal } = campaignData;
    
    // Generate persona based on inputs
    let persona = {
      name: 'Sarah Johnson',
      role: 'Marketing Director',
      company_size: 'Mid-size (100-500 employees)',
      industry: 'Technology',
      age_range: '35-45',
      location: 'Urban areas',
      education: 'Bachelor\'s degree or higher'
    };
    
    // Customize based on audience description
    if (audienceDescription.toLowerCase().includes('ceo') || audienceDescription.toLowerCase().includes('executive')) {
      persona.name = 'Michael Chen';
      persona.role = 'Chief Executive Officer';
      persona.age_range = '45-55';
    } else if (audienceDescription.toLowerCase().includes('startup') || audienceDescription.toLowerCase().includes('founder')) {
      persona.name = 'Alex Rivera';
      persona.role = 'Startup Founder';
      persona.company_size = 'Small (10-50 employees)';
      persona.age_range = '28-38';
    }
    
    persona.challenges = [
      'Limited marketing budget requiring careful allocation',
      'Need to demonstrate clear ROI on marketing investments',
      'Keeping up with rapidly changing digital marketing landscape',
      'Competition for audience attention in crowded market'
    ];
    
    persona.goals = [
      'Increase qualified lead generation by 40%',
      'Improve brand awareness in target market',
      'Optimize marketing spend efficiency',
      'Build long-term customer relationships'
    ];
    
    persona.preferred_channels = ['LinkedIn', 'Industry publications', 'Email newsletters', 'Webinars'];
    
    persona.pain_points = [
      'Difficulty measuring marketing attribution',
      'Managing multiple marketing channels effectively',
      'Creating content that resonates with target audience',
      'Staying within budget while scaling campaigns'
    ];
    
    return persona;
  }

  async generateMessagingAngles(campaignData, persona) {
    await this.delay();
    
    const angles = [
      {
        angle: 'ROI-Focused',
        headline: 'Maximize Your Marketing ROI',
        description: 'Emphasize measurable results, cost-effectiveness, and clear return on investment',
        key_messages: [
          'Proven track record of delivering 3x ROI',
          'Transparent reporting and analytics',
          'Cost-effective solutions that scale'
        ],
        confidence: 85,
        target_emotion: 'Trust and confidence'
      },
      {
        angle: 'Innovation Leader',
        headline: 'Stay Ahead of the Competition',
        description: 'Position as cutting-edge solution that gives competitive advantage',
        key_messages: [
          'Latest technology and industry innovations',
          'First-mover advantage in your market',
          'Future-proof your marketing strategy'
        ],
        confidence: 78,
        target_emotion: 'Excitement and ambition'
      },
      {
        angle: 'Time-Saving Efficiency',
        headline: 'Streamline Your Marketing Operations',
        description: 'Focus on automation, efficiency, and freeing up valuable time',
        key_messages: [
          'Automate repetitive marketing tasks',
          'Save 10+ hours per week on campaign management',
          'Focus on strategy while we handle execution'
        ],
        confidence: 82,
        target_emotion: 'Relief and productivity'
      },
      {
        angle: 'Expert Partnership',
        headline: 'Your Trusted Marketing Partner',
        description: 'Emphasize expertise, support, and collaborative relationship',
        key_messages: [
          'Dedicated account management and support',
          '10+ years of industry expertise',
          'Collaborative approach to your success'
        ],
        confidence: 76,
        target_emotion: 'Security and partnership'
      }
    ];
    
    return angles;
  }

  async generateVisualThemes(campaignData, persona, messagingAngles) {
    await this.delay();
    
    const themes = [
      {
        theme: 'Professional & Clean',
        description: 'Minimalist design with professional color palette and clean typography',
        color_palette: ['#2563eb', '#1e40af', '#f8fafc', '#64748b'],
        typography: 'Modern sans-serif fonts',
        imagery_style: 'Professional photography, clean graphics',
        mood: 'Trustworthy, reliable, sophisticated',
        confidence: 84
      },
      {
        theme: 'Bold & Dynamic',
        description: 'Vibrant colors and dynamic layouts that command attention',
        color_palette: ['#dc2626', '#ea580c', '#facc15', '#1f2937'],
        typography: 'Bold, impactful fonts',
        imagery_style: 'High-energy visuals, motion graphics',
        mood: 'Energetic, innovative, confident',
        confidence: 79
      },
      {
        theme: 'Warm & Approachable',
        description: 'Friendly design with warm colors and approachable messaging',
        color_palette: ['#059669', '#0d9488', '#fef3c7', '#374151'],
        typography: 'Friendly, readable fonts',
        imagery_style: 'Authentic photography, illustrations',
        mood: 'Welcoming, trustworthy, human',
        confidence: 77
      }
    ];
    
    return themes;
  }

  async generateCreativeVisual(messagingAngle, visualTheme, companyName, businessDescription, campaignGoal, audienceDescription, persona) {
    await this.delay(2500);
    
    const creatives = [
      {
        title: `${messagingAngle.angle} - Primary Creative`,
        concept: `A ${visualTheme.mood} visual that emphasizes ${messagingAngle.headline.toLowerCase()} through ${visualTheme.description.toLowerCase()}`,
        image_url: await this.callOpenAIImageGeneration(`${visualTheme.description} ${messagingAngle.angle} creative`),
        headline: messagingAngle.headline,
        subheadline: `Transform your ${businessDescription.split(' ').slice(0, 3).join(' ')} with proven strategies`,
        call_to_action: 'Get Started Today',
        design_notes: `Uses ${visualTheme.color_palette.join(', ')} color scheme with ${visualTheme.typography}`
      },
      {
        title: `${messagingAngle.angle} - Alternative A`,
        concept: `A variation focusing on ${persona.role} pain points with ${visualTheme.imagery_style}`,
        image_url: await this.callOpenAIImageGeneration(`professional ${visualTheme.mood} business creative`),
        headline: `${companyName}: ${messagingAngle.key_messages[0]}`,
        subheadline: `Perfect for ${persona.role}s who want ${campaignGoal.toLowerCase()}`,
        call_to_action: 'Learn More',
        design_notes: `Emphasizes ${messagingAngle.target_emotion} through visual hierarchy`
      },
      {
        title: `${messagingAngle.angle} - Alternative B`,
        concept: `A results-focused creative highlighting key benefits with ${visualTheme.theme} aesthetic`,
        image_url: await this.callOpenAIImageGeneration(`colorful creative ${visualTheme.theme} design`),
        headline: messagingAngle.key_messages[1] || 'Drive Real Results',
        subheadline: `Join ${persona.company_size} companies achieving their goals`,
        call_to_action: 'Start Free Trial',
        design_notes: `Incorporates ${visualTheme.imagery_style} with clear value proposition`
      }
    ];
    
    return creatives;
  }

  async generateMediaPublicationRecommendations(campaignData, persona) {
    await this.delay();
    
    const publications = [
      {
        publication: 'Marketing Land',
        type: 'Industry Publication',
        audience_match: 92,
        reasoning: 'Leading marketing publication with high readership among marketing professionals',
        ad_formats: ['Display ads', 'Sponsored content', 'Newsletter sponsorship'],
        estimated_reach: '500K+ monthly readers'
      },
      {
        publication: 'Harvard Business Review',
        type: 'Business Publication',
        audience_match: 88,
        reasoning: 'Premium business publication targeting senior executives and decision makers',
        ad_formats: ['Sponsored articles', 'Display ads', 'Webinar partnerships'],
        estimated_reach: '2M+ monthly readers'
      },
      {
        publication: 'TechCrunch',
        type: 'Technology Publication',
        audience_match: 85,
        reasoning: 'Top technology publication for startups and tech companies',
        ad_formats: ['Display ads', 'Sponsored posts', 'Event partnerships'],
        estimated_reach: '10M+ monthly readers'
      }
    ];
    
    return publications;
  }

  async generateCreativeBrief(campaignData, aiResults) {
    await this.delay();
    
    const brief = `# Creative Brief - ${campaignData.companyName}

## Campaign Overview
**Objective:** ${campaignData.campaignGoal}
**Target Audience:** ${campaignData.audienceDescription}
**Budget:** £${campaignData.budget}
**Geographic Focus:** ${campaignData.targetAreas}

## Business Context
${campaignData.businessDescription}

## Target Persona
**Name:** ${aiResults.messaging?.persona?.name || 'Primary Persona'}
**Role:** ${aiResults.messaging?.persona?.role || 'Decision Maker'}
**Key Challenges:** ${aiResults.messaging?.persona?.challenges?.join(', ') || 'Business growth challenges'}

## Recommended Strategy
Based on our analysis, we recommend focusing on ${aiResults.recommendations?.channels?.[0]?.channel || 'digital channels'} with an emphasis on ${aiResults.messaging?.messagingAngles?.[0]?.angle || 'value-driven messaging'}.

## Creative Direction
**Visual Theme:** ${aiResults.messaging?.visualThemes?.[0]?.theme || 'Professional & Clean'}
**Messaging Angle:** ${aiResults.messaging?.messagingAngles?.[0]?.headline || 'Results-Focused Approach'}
**Key Messages:**
- ${aiResults.messaging?.messagingAngles?.[0]?.key_messages?.[0] || 'Proven results and ROI'}
- ${aiResults.messaging?.messagingAngles?.[0]?.key_messages?.[1] || 'Expert guidance and support'}
- ${aiResults.messaging?.messagingAngles?.[0]?.key_messages?.[2] || 'Scalable solutions'}

## Success Metrics
- Lead generation increase: 40-60%
- Cost per acquisition reduction: 20-30%
- Brand awareness improvement: 25-35%

## Next Steps
1. Finalize creative assets based on selected themes
2. Set up tracking and analytics infrastructure
3. Launch pilot campaigns with A/B testing
4. Monitor performance and optimize based on results

---
*This brief was generated using AI-powered campaign strategy analysis.*`;
    
    return brief;
  }
}

const aiServiceStatic = new AIServiceStatic();
export default aiServiceStatic;
