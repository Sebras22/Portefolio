export type Lang = 'fr' | 'en'

export interface TimelineItem {
  kind: 'work' | 'study'
  title: string
  org: string
  period: string
  place?: string
  points?: string[]
  stack?: string[]
}

export interface ProjectText {
  name: string
  subtitle: string
  text: string
}

export interface Dict {
  meta: { title: string; description: string }
  nav: {
    home: string
    journey: string
    projects: string
    skills: string
    contact: string
    menu: string
    close: string
    themeToLight: string
    themeToDark: string
    langSwitch: string
  }
  hero: { status: string; role: string; seeProjects: string; reach: string }
  about: {
    title: string
    text: string
    location: string
    langs: string
    values: { title: string; text: string }[]
  }
  journey: { title: string; intro: string; items: TimelineItem[] }
  projects: {
    title: string
    intro: string
    mockup: string
    shot: string
    code: string
    site: string
    items: ProjectText[]
  }
  skills: {
    title: string
    design: { title: string; text: string }
    autonomy: { title: string; text: string }
    front: string
    back: string
    tools: string
  }
  hobbies: { title: string; text: string; items: string[]; details: { stat?: string; text: string }[] }
  contact: { title: string; text: string; copy: string; copied: string; github: string; linkedin: string }
  easter: { wake: string }
  music: { label: string; play: string; pause: string; volume: string }
  footer: { rights: string; legal: string }
  legal: { title: string; publisher: string; contact: string; host: string; close: string }
}
