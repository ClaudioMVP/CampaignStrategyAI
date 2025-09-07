from flask import Blueprint, request, jsonify, send_file
import os
import uuid
from datetime import datetime

image_gen_bp = Blueprint('image_generation', __name__)

def generate_creative_prompt(campaign_data, messaging_angle, visual_theme, variation_type):
    """Generate detailed prompts for AI image generation based on campaign context and variation type"""
    
    company_name = campaign_data.get('company_name', 'TechSolutions Pro')
    business_description = campaign_data.get('business_description', 'Cloud-based project management software')
    campaign_goal = campaign_data.get('campaign_goal', 'Generate Leads')
    target_audience = campaign_data.get('target_audience', 'Small business owners and project managers')
    
    # Base messaging angle elements
    messaging_elements = {
        'Time-Saving': {
            'symbols': 'clock icons, calendar elements, efficiency arrows, streamlined processes, automation symbols',
            'concepts': 'time efficiency, productivity boost, workflow optimization, quick results, streamlined operations',
            'colors': 'blue for efficiency, orange for energy, green for progress'
        },
        'ROI-Focused': {
            'symbols': 'percentage symbols, dollar signs, upward trending arrows, growth charts, profit graphs',
            'concepts': 'return on investment, cost savings, financial growth, measurable results, revenue increase',
            'colors': 'green for growth, blue for trust, gold for value'
        },
        'Competitive Advantage': {
            'symbols': 'comparison charts, leadership arrows, winner podiums, competitive graphs, market position indicators',
            'concepts': 'market leadership, competitive edge, industry innovation, superior performance, strategic advantage',
            'colors': 'blue for authority, red for power, purple for premium'
        }
    }
    
    # Visual theme styling
    theme_styles = {
        'Innovation Leadership': {
            'style': 'modern tech aesthetic with cutting-edge design elements',
            'elements': 'futuristic imagery, tech innovation symbols, progressive design elements, forward-thinking visuals',
            'mood': 'innovative, progressive, industry-leading',
            'layout': 'dynamic asymmetrical layout with modern typography'
        },
        'Professional Authority': {
            'style': 'clean corporate design with professional photography',
            'elements': 'business professionals, corporate environments, authoritative layouts, enterprise imagery',
            'mood': 'trustworthy, authoritative, enterprise-ready',
            'layout': 'structured grid layout with clear hierarchy'
        },
        'Data-Driven Results': {
            'style': 'analytical dashboard design with data visualization',
            'elements': 'charts and graphs, analytics dashboards, performance metrics, data visualization',
            'mood': 'analytical, results-focused, evidence-based',
            'layout': 'dashboard-style layout with prominent data displays'
        }
    }
    
    # Variation-specific approaches
    variation_approaches = {
        'concept_focused': {
            'emphasis': 'conceptual illustration with symbolic representation of time-saving benefits',
            'approach': 'abstract and symbolic with clear messaging hierarchy showing efficiency gains'
        },
        'data_visualization': {
            'emphasis': 'data-driven visual with charts showing time savings and productivity metrics',
            'approach': 'infographic style with prominent statistics showing before/after productivity improvements'
        },
        'lifestyle_context': {
            'emphasis': 'real-world application showing busy professionals using the software',
            'approach': 'lifestyle photography with contextual business scenarios showing time being saved'
        }
    }
    
    msg_data = messaging_elements.get(messaging_angle, messaging_elements['Time-Saving'])
    theme_data = theme_styles.get(visual_theme, theme_styles['Innovation Leadership'])
    var_data = variation_approaches.get(variation_type, variation_approaches['concept_focused'])
    
    # Build comprehensive prompt
    prompt = f"""Create a professional marketing campaign creative for {company_name}, a technology company providing {business_description}.

Campaign Context:
- Goal: {campaign_goal}
- Target Audience: {target_audience[:150]}

Messaging Angle - {messaging_angle}:
- Key symbols: {msg_data['symbols']}
- Core concepts: {msg_data['concepts']}
- Color palette: {msg_data['colors']}

Visual Theme - {visual_theme}:
- Style: {theme_data['style']}
- Visual elements: {theme_data['elements']}
- Mood: {theme_data['mood']}
- Layout: {theme_data['layout']}

Variation Approach - {variation_type.replace('_', ' ').title()}:
- Emphasis: {var_data['emphasis']}
- Creative approach: {var_data['approach']}

Design Requirements:
- High-quality, professional marketing creative suitable for digital campaigns
- Clear visual hierarchy with space for compelling headlines
- Modern, clean aesthetic that appeals to tech-savvy business professionals
- Include visual elements that clearly communicate {messaging_angle.lower()} benefits
- {theme_data['style']} with {theme_data['mood']} feeling
- Incorporate {msg_data['symbols']} in a sophisticated way
- Use {msg_data['colors']} color scheme
- 16:9 landscape format, marketing campaign ready, professional quality"""
    
    return prompt

@image_gen_bp.route('/generate-creative-images', methods=['POST'])
def generate_creative_images():
    """Generate 3 creative image variations based on campaign context"""
    try:
        data = request.get_json()
        
        # Extract campaign data
        campaign_data = {
            'company_name': data.get('company_name', 'TechSolutions Pro'),
            'business_description': data.get('business_description', 'Cloud-based project management software'),
            'campaign_goal': data.get('campaign_goal', 'Generate Leads'),
            'target_audience': data.get('target_audience', 'Small business owners and project managers'),
        }
        
        messaging_angle = data.get('messaging_angle', 'Time-Saving')
        visual_theme = data.get('visual_theme', 'Innovation Leadership')
        
        # Generate 3 different creative variations
        variations = [
            {
                'id': 'concept_focused',
                'title': 'Concept-Driven Creative',
                'description': 'Symbolic and conceptual approach emphasizing core messaging through visual metaphors',
                'prompt': generate_creative_prompt(campaign_data, messaging_angle, visual_theme, 'concept_focused')
            },
            {
                'id': 'data_visualization',
                'title': 'Data-Driven Creative',
                'description': 'Infographic-style design highlighting key metrics and performance indicators',
                'prompt': generate_creative_prompt(campaign_data, messaging_angle, visual_theme, 'data_visualization')
            },
            {
                'id': 'lifestyle_context',
                'title': 'Contextual Creative',
                'description': 'Real-world application showing the solution in action with target audience',
                'prompt': generate_creative_prompt(campaign_data, messaging_angle, visual_theme, 'lifestyle_context')
            }
        ]
        
        # Return the prompts for frontend to handle image generation
        response = {
            'success': True,
            'campaign_context': {
                'company_name': campaign_data['company_name'],
                'messaging_angle': messaging_angle,
                'visual_theme': visual_theme,
                'campaign_goal': campaign_data['campaign_goal']
            },
            'creative_variations': variations,
            'generation_timestamp': datetime.now().isoformat()
        }
        
        return jsonify(response)
        
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e)
        }), 500

