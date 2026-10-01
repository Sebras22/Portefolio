export const EMAIL = 'contact@sebastienbranly.fr'
export const GITHUB_URL = 'https://github.com/Sebras22'
export const LINKEDIN_URL = 'https://www.linkedin.com/in/sebastien-branly-dev/'

export interface ProjectMeta {
  id: 'morse' | 'arkadia' | 'todo'
  stack: string[]
  codeUrl?: string
  siteUrl?: string
  image?: { src: string; width: number; height: number }
}

export const projectsMeta: ProjectMeta[] = [
  {
    id: 'morse',
    stack: ['React', 'TypeScript', 'GraphQL'],
    codeUrl: 'https://github.com/Hydevs-Corp/Morse-Front',
  },
  {
    id: 'arkadia',
    stack: ['React', 'TypeScript', 'Mantine', 'Hono', 'MySQL'],
    siteUrl: 'https://www.gameofarkadia.net/',
    image: { src: '/projects/arkadia.webp', width: 1440, height: 900 },
  },
  {
    id: 'todo',
    stack: ['Angular', 'TypeScript'],
    codeUrl: 'https://github.com/Sebras22/TodoListAngular',
    image: { src: '/projects/todolist.webp', width: 1441, height: 900 },
  },
]

export const skillTags = {
  design: ['Figma', 'UI / UX', 'Wireframes'],
  front: ['React', 'TypeScript', 'Mantine', 'MaterialUI', 'Vue', 'Angular', 'Motion'],
  back: ['Java Spring', 'Node.js', 'Hono', 'GraphQL', 'MySQL', 'PostgreSQL'],
  tools: ['Cypress', 'Jest', 'AWS', 'Docker', 'Git', 'Jira'],
}
