export const patterns = {
  dashboard: {
    backgroundColor: 'rgb(255 255 255)',
    backgroundImage: `
      linear-gradient(to right, rgba(240, 240, 240, 0.5) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(240, 240, 240, 0.5) 1px, transparent 1px),
      linear-gradient(135deg, rgba(18, 194, 233, 0.02) 25%, transparent 25%),
      linear-gradient(225deg, rgba(196, 113, 237, 0.02) 25%, transparent 25%)
    `,
    backgroundSize: '40px 40px, 40px 40px, 80px 80px, 80px 80px',
  },
  dashboardDark: {
    backgroundColor: 'rgb(17 24 39)',
    backgroundImage: `
      linear-gradient(to right, rgba(55, 65, 81, 0.3) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(55, 65, 81, 0.3) 1px, transparent 1px),
      linear-gradient(135deg, rgba(18, 194, 233, 0.05) 25%, transparent 25%),
      linear-gradient(225deg, rgba(196, 113, 237, 0.05) 25%, transparent 25%)
    `,
    backgroundSize: '40px 40px, 40px 40px, 80px 80px, 80px 80px',
  },
  auth: {
    backgroundColor: 'rgb(249 250 251)',
    backgroundImage: `
      linear-gradient(to right, rgba(240, 240, 240, 0.5) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(240, 240, 240, 0.5) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
  },
  authDark: {
    backgroundColor: 'rgb(17 24 39)',
    backgroundImage: `
      linear-gradient(to right, rgba(55, 65, 81, 0.3) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(55, 65, 81, 0.3) 1px, transparent 1px)
    `,
    backgroundSize: '40px 40px',
  },
  card: {
    backgroundColor: 'rgb(255 255 255)',
    backgroundImage: `
      radial-gradient(circle at center, rgba(240, 240, 240, 0.5) 1px, transparent 1px)
    `,
    backgroundSize: '24px 24px',
  },
  cardDark: {
    backgroundColor: 'rgb(31 41 55)',
    backgroundImage: `
      radial-gradient(circle at center, rgba(55, 65, 81, 0.3) 1px, transparent 1px)
    `,
    backgroundSize: '24px 24px',
  },
};