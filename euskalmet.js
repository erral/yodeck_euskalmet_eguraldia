const getForecastUrl = (city) => {
  // Add a cache buster parameter that changes every 4 hours
  // in order to avoid caching the JSON with the forecast
  // in the client's browser
  const cache_buster = parseInt(new Date().getTime() / (1000 * 60 * 60 * 4));
  return `https://raw.githubusercontent.com/codesyntax/euskalmet-eguraldi-iragarpena/main/forecasts/${city}-euskalmet.json?time=${cache_buster}`;
};

const AVAILABLE_LANGUAGES = {
  eu: 'BASQUE',
  es: 'SPANISH',
};

const template = document.createElement('template');

template.innerHTML = `
  <style>
    :host {
      --card-background: #f8f9fa;
      --card-border-radius: 12px;
      --card-padding: 1.5rem;
      --text-color: #333;
      --temp-min-color: #007bff;
      --temp-max-color: #dc3545;
      --font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
      display: block;
    }
    .euskalmet-body {
      display: flex;
      gap: 1.5rem;
      font-family: var(--font-family);
    }
    .euskalmet-forecast-day {
      background: var(--card-background);
      border-radius: var(--card-border-radius);
      padding: var(--euskalmet-forecast-day-padding, var(--card-padding));
      text-align: var(--euskalmet-forecast-day-text-align, center);
      flex: 1;
      box-shadow: 0 4px 12px rgba(0,0,0,0.08);
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }
    .euskalmet-forecast-day:hover {
      transform: translateY(-5px);
      box-shadow: 0 8px 20px rgba(0,0,0,0.12);
    }
    .euskalmet-forecast-date {
      font-size: 1.1rem;
      font-weight: 600;
      color: var(--text-color);
      margin: 0 0 1rem;
    }
    .euskalmet-forecast-symbol img {
      width: 80px;
      height: 80px;
      margin-bottom: 0.5rem;
    }
    .euskalmet-forecast-symbol {
      font-size: 0.9rem;
      color: #666;
    }
    .euskalmet-forecast-temperature {
      font-size: 1.25rem;
      font-weight: 700;
      margin-top: 1rem;
    }
    .euskalmet-forecast-temperature-low {
      color: var(--temp-min-color);
    }
    .euskalmet-forecast-temperature-high {
      color: var(--temp-max-color);
    }
  </style>
  <div class="euskalmet">
    <div class="euskalmet-inner">
      <div class="euskalmet-header">
      </div>
      <div class="euskalmet-body">
      </div>
    </div>
  </div>
`;

class Euskalmet extends HTMLElement {
  constructor() {
    super();
    this._shadowRoot = this.attachShadow({ mode: 'open' });
    this._shadowRoot.appendChild(template.content.cloneNode(true));
  }

  get city() {
    return this.getAttribute('city');
  }

  get days() {
    return this.getAttribute('days');
  }

  get language() {
    return AVAILABLE_LANGUAGES[this.getAttribute('language')];
  }

  get direction() {
    return this.getAttribute('direction');
  }

  get shortText() {
    return this.getAttribute('short-text');
  }

  get customBaseUrl() {
    return this.getAttribute('custom-base-url');
  }

  get customIconExtension() {
    return this.getAttribute('custom-icon-extension');
  }

  get modernImages() {
    return this.getAttribute('modern-images');
  }

  async connectedCallback() {
    const response = await fetch(getForecastUrl(this.city));
    const data = await response.json();
    const trends = data['trendsByDate'].sort((a, b) => {
      return a['date'].localeCompare(b['date']);
    });
    const body = this._shadowRoot.querySelector('.euskalmet-body');
    body.style = `flex-direction: ${this.direction}`;
    trends.slice(0, parseInt(this.days)).map((item) => {
      let div = document.createElement('div');
      let forecastText = item.weather.nameByLang[this.language];
      div.className = 'euskalmet-forecast-day';

      let dateObject = new Date(item.date);
      const locale = `${this.getAttribute('language') || 'eu'}-ES`;
      const weekday = dateObject.toLocaleDateString(locale, { weekday: 'long', timeZone: 'Europe/Madrid' });
      const day = dateObject.getDate();
      let dateText = `${weekday} ${day}`;
      let shortText = this.shortText ? forecastText : '';

      let imageUrl = this.modernImages
        ? this.customBaseUrl
          ? this.customIconExtension
            ? `${this.customBaseUrl}/i${item.weather.id}d.${this.customIconExtension}`
            : `${this.customBaseUrl}/${item.weather.icon_name_modern}`
          : item.weather.full_path_modern
        : this.customBaseUrl
        ? this.customIconExtension
          ? `${this.customBaseUrl}/${item.weather.id}.${this.customIconExtension}`
          : `${this.customBaseUrl}/${item.weather.icon_name}`
        : item.weather.full_path;

      div.innerHTML = `
      <p class="euskalmet-forecast-date">
        ${dateText}
      </p>
      <p class="euskalmet-forecast-symbol">
        <img src="${imageUrl}" alt="${forecastText}" /> <br/>
        ${shortText}
      </p>

      <p class="euskalmet-forecast-temperature">
        <span class="euskalmet-forecast-temperature-low">${item.temperatureRange.min} ºC</span> - <span class="euskalmet-forecast-temperature-high">${item.temperatureRange.max} ºC</span>
      </p>

      `;

      body.appendChild(div);
    });
  }
}

window.customElements.define('euskalmet-eguraldia', Euskalmet);

