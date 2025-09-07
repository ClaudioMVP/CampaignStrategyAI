// Enhanced Creative Generator with 3 Variations
class EnhancedCreativeGenerator {
    constructor() {
        this.campaignData = {};
        this.currentSelections = {
            messagingAngle: null,
            visualTheme: null
        };
        this.generatedCreatives = [];
        this.init();
    }

    init() {
        // Store campaign data from previous steps
        this.storeCampaignData();
        
        // Enhance the existing Generate Creative Visual button
        this.enhanceGenerateButton();
        
        // Add loading and results containers
        this.addUIElements();
    }

    storeCampaignData() {
        // Extract campaign data from the existing form or localStorage
        // This would typically be stored during the campaign setup process
        this.campaignData = {
            company_name: this.getStoredValue('company_name') || 'TechSolutions Pro',
            business_description: this.getStoredValue('business_description') || 'Cloud-based project management software',
            campaign_goal: this.getStoredValue('campaign_goal') || 'Generate Leads',
            target_audience: this.getStoredValue('target_audience') || 'Small business owners and project managers',
            monthly_budget: this.getStoredValue('monthly_budget') || '5000',
            target_areas: this.getStoredValue('target_areas') || 'UK-wide'
        };
    }

    getStoredValue(key) {
        // Try to get from localStorage or sessionStorage
        return localStorage.getItem(key) || sessionStorage.getItem(key);
    }

    enhanceGenerateButton() {
        const generateBtn = document.querySelector('button:contains("Generate Creative Visual")') || 
                           document.querySelector('[class*="generate"]') ||
                           document.querySelector('button[class*="teal"]');
        
        if (generateBtn) {
            generateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleGenerateCreatives();
            });
        }
    }

    addUIElements() {
        // Add loading container
        const loadingHTML = `
            <div id="creative-loading" class="hidden mt-6 p-6 bg-gray-50 rounded-lg">
                <div class="text-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <h3 class="text-lg font-semibold text-gray-800 mb-2">Generating AI-Powered Creatives</h3>
                    <p class="text-gray-600">Creating 3 unique creative variations based on your selections...</p>
                    <div class="mt-4">
                        <div class="bg-gray-200 rounded-full h-2">
                            <div id="progress-bar" class="bg-blue-600 h-2 rounded-full transition-all duration-1000" style="width: 0%"></div>
                        </div>
                    </div>
                </div>
            </div>
        `;

        // Add results container
        const resultsHTML = `
            <div id="creative-results" class="hidden mt-6">
                <div class="mb-6">
                    <h3 class="text-xl font-bold text-gray-800 mb-2">🎨 AI-Generated Creative Variations</h3>
                    <p class="text-gray-600">Here are 3 unique creative approaches based on your messaging angle and visual theme:</p>
                </div>
                <div id="creative-cards-container" class="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <!-- Creative cards will be inserted here -->
                </div>
                <div class="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 class="font-semibold text-blue-800 mb-2">💡 Creative Strategy Insights</h4>
                    <div id="strategy-insights" class="text-blue-700 text-sm">
                        <!-- Strategy insights will be inserted here -->
                    </div>
                </div>
            </div>
        `;

        // Find the existing creative visual section and add our enhancements
        const creativeSection = document.querySelector('[class*="Creative Visual"]')?.parentElement ||
                               document.querySelector('h3:contains("Creative Visual")')?.parentElement ||
                               document.body;

        if (creativeSection) {
            creativeSection.insertAdjacentHTML('beforeend', loadingHTML + resultsHTML);
        }
    }

    async handleGenerateCreatives() {
        // Get current selections
        this.getCurrentSelections();
        
        if (!this.currentSelections.messagingAngle || !this.currentSelections.visualTheme) {
            alert('Please select both a messaging angle and visual theme before generating creatives.');
            return;
        }

        // Show loading state
        this.showLoading();

        try {
            // Call the backend API to generate creative prompts
            const response = await fetch('/api/generate-creative', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...this.campaignData,
                    messaging_angle: this.currentSelections.messagingAngle,
                    visual_theme: this.currentSelections.visualTheme
                })
            });

            const data = await response.json();

            if (data.success) {
                // Generate actual images for each variation
                await this.generateCreativeImages(data.creative_variations, data.campaign_context);
            } else {
                throw new Error(data.error || 'Failed to generate creative prompts');
            }

        } catch (error) {
            console.error('Error generating creatives:', error);
            this.showError(error.message);
        }
    }

    getCurrentSelections() {
        // Extract current messaging angle and visual theme selections
        const messagingBtn = document.querySelector('button:contains("ROI-Focused"), button:contains("Time-Saving"), button:contains("Competitive Advantage")');
        const themeBtn = document.querySelector('button:contains("Professional Authority"), button:contains("Data-Driven Results"), button:contains("Innovation Leadership")');

        if (messagingBtn && !messagingBtn.textContent.includes('Choose')) {
            this.currentSelections.messagingAngle = messagingBtn.textContent.trim();
        }

        if (themeBtn && !themeBtn.textContent.includes('Choose')) {
            this.currentSelections.visualTheme = themeBtn.textContent.trim();
        }
    }

    showLoading() {
        const loadingEl = document.getElementById('creative-loading');
        const resultsEl = document.getElementById('creative-results');
        
        if (loadingEl) {
            loadingEl.classList.remove('hidden');
            this.animateProgress();
        }
        
        if (resultsEl) {
            resultsEl.classList.add('hidden');
        }

        // Hide existing placeholder
        const existingPlaceholder = document.querySelector('img[src*="creative-visual"]');
        if (existingPlaceholder) {
            existingPlaceholder.parentElement.style.display = 'none';
        }
    }

    animateProgress() {
        const progressBar = document.getElementById('progress-bar');
        if (progressBar) {
            let width = 0;
            const interval = setInterval(() => {
                width += Math.random() * 15;
                if (width >= 90) {
                    clearInterval(interval);
                    width = 90;
                }
                progressBar.style.width = width + '%';
            }, 500);
        }
    }

    async generateCreativeImages(variations, campaignContext) {
        const creativeCards = [];

        for (let i = 0; i < variations.length; i++) {
            const variation = variations[i];
            
            try {
                // Update progress
                this.updateProgress(`Generating ${variation.title}...`, 30 + (i * 20));

                // Generate image using the AI image generation API
                const imageResponse = await this.generateImage(variation.prompt, variation.id);
                
                creativeCards.push({
                    ...variation,
                    imageUrl: imageResponse.imageUrl,
                    generated: true
                });

            } catch (error) {
                console.error(`Error generating image for ${variation.title}:`, error);
                // Use fallback placeholder
                creativeCards.push({
                    ...variation,
                    imageUrl: '/creative-visual-placeholder.png',
                    generated: false,
                    error: error.message
                });
            }
        }

        // Complete progress
        this.updateProgress('Finalizing creatives...', 100);

        // Show results after a brief delay
        setTimeout(() => {
            this.showResults(creativeCards, campaignContext);
        }, 1000);
    }

    async generateImage(prompt, variationId) {
        // This would integrate with your image generation service
        // For now, we'll simulate the API call and return a placeholder
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // In a real implementation, this would call your image generation API
        // return await fetch('/api/generate-image', { ... });
        
        // For demo purposes, return different placeholder based on variation
        const placeholders = {
            'concept_focused': '/creative-visual-competitive-advantage.png',
            'data_visualization': '/creative-visual-roi-focused.png',
            'lifestyle_context': '/creative-visual-time-saving.png'
        };

        return {
            imageUrl: placeholders[variationId] || '/creative-visual-roi-focused.png'
        };
    }

    updateProgress(message, percentage) {
        const progressBar = document.getElementById('progress-bar');
        const loadingEl = document.getElementById('creative-loading');
        
        if (progressBar) {
            progressBar.style.width = percentage + '%';
        }
        
        if (loadingEl) {
            const messageEl = loadingEl.querySelector('p');
            if (messageEl) {
                messageEl.textContent = message;
            }
        }
    }

    showResults(creativeCards, campaignContext) {
        const loadingEl = document.getElementById('creative-loading');
        const resultsEl = document.getElementById('creative-results');
        const cardsContainer = document.getElementById('creative-cards-container');
        const insightsContainer = document.getElementById('strategy-insights');

        // Hide loading
        if (loadingEl) {
            loadingEl.classList.add('hidden');
        }

        // Generate creative cards HTML
        const cardsHTML = creativeCards.map((card, index) => `
            <div class="bg-white rounded-lg shadow-lg overflow-hidden border border-gray-200 hover:shadow-xl transition-shadow">
                <div class="relative">
                    <img src="${card.imageUrl}" alt="${card.title}" class="w-full h-48 object-cover">
                    <div class="absolute top-2 right-2">
                        <span class="bg-blue-600 text-white px-2 py-1 rounded text-xs font-semibold">
                            Variation ${index + 1}
                        </span>
                    </div>
                    ${!card.generated ? '<div class="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center"><span class="text-white text-sm">Demo Placeholder</span></div>' : ''}
                </div>
                <div class="p-4">
                    <h4 class="font-bold text-lg text-gray-800 mb-2">${card.title}</h4>
                    <p class="text-gray-600 text-sm mb-3">${card.description}</p>
                    <div class="flex justify-between items-center">
                        <button class="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition-colors">
                            Download
                        </button>
                        <button class="text-blue-600 text-sm hover:text-blue-800 transition-colors">
                            Customize
                        </button>
                    </div>
                </div>
            </div>
        `).join('');

        // Generate insights HTML
        const insightsHTML = `
            <div class="space-y-2">
                <p><strong>Campaign Context:</strong> ${campaignContext.company_name} - ${campaignContext.campaign_goal}</p>
                <p><strong>Messaging Strategy:</strong> ${campaignContext.messaging_angle} approach with ${campaignContext.visual_theme} styling</p>
                <p><strong>Creative Variations:</strong> Each creative uses a different approach (conceptual, data-driven, contextual) to appeal to different audience segments and enable A/B testing.</p>
                <p><strong>Recommendation:</strong> Test all three variations to identify which resonates best with your target audience, then optimize the winning approach.</p>
            </div>
        `;

        // Update the DOM
        if (cardsContainer) {
            cardsContainer.innerHTML = cardsHTML;
        }

        if (insightsContainer) {
            insightsContainer.innerHTML = insightsHTML;
        }

        // Show results
        if (resultsEl) {
            resultsEl.classList.remove('hidden');
            resultsEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Store results
        this.generatedCreatives = creativeCards;
    }

    showError(message) {
        const loadingEl = document.getElementById('creative-loading');
        
        if (loadingEl) {
            loadingEl.innerHTML = `
                <div class="text-center p-6">
                    <div class="text-red-600 mb-4">
                        <svg class="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                    </div>
                    <h3 class="text-lg font-semibold text-gray-800 mb-2">Generation Failed</h3>
                    <p class="text-gray-600 mb-4">${message}</p>
                    <button onclick="location.reload()" class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors">
                        Try Again
                    </button>
                </div>
            `;
        }
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Add some delay to ensure the original app has loaded
    setTimeout(() => {
        new EnhancedCreativeGenerator();
    }, 1000);
});

// Helper function for text content matching
Element.prototype.matches = Element.prototype.matches || Element.prototype.msMatchesSelector || function(s) {
    var matches = (this.document || this.ownerDocument).querySelectorAll(s),
        i = matches.length;
    while (--i >= 0 && matches.item(i) !== this) {}
    return i > -1;
};

// Helper to find elements by text content
document.querySelector = function(selector) {
    if (selector.includes(':contains(')) {
        const match = selector.match(/:contains\("([^"]+)"\)/);
        if (match) {
            const text = match[1];
            const elements = Array.from(document.querySelectorAll('*'));
            return elements.find(el => el.textContent && el.textContent.includes(text));
        }
    }
    return Document.prototype.querySelector.call(this, selector);
};

