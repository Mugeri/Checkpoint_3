var TestDocuments = [
  {
    title: 'ALPHABETS',
    content:'fgdahsjleiuyvabnlekfhrsuigrkeljfiov',
    Owner: 'stranger',
    CreatedAt: new Date(Date.now()),
    Permissions: 'Public'
  },
  {
    title: 'Numbers',
    content: '1234567890 09876543',
    Owner: 'stranger',
    CreatedAt: new Date(Date.now() + 1),
    Permissions: 'Private'
  },
  {
    title: 'Nursery Rhyme',
    content: "Johnny, Johnny yes papa, eating sugar? no papa, open your mouth\
              hahaha.",
    Owner: 'ganjez',
    CreatedAt: new Date(Date.now() + 2),
    Permissions: 'Public'
  },
  {
    title: 'Songs',
    content: 'Run, run lost boy, they say to me, Neverlands home to lost boys\
              like me and lost boys like me are free',
    Owner: 'ganjez',
    CreatedAt: new Date(Date.now() + 3),
    Permissions: 'Private'
  },
  {
    title: 'Football Clubs',
    content: 'Chelsea, Paris Saint German, Arsenal, Manchester United.',
    CreatedAt: new Date(Date.now() + 4),
    Permissions: 'Public'

  },
  {
    title: 'Mwanake',
    content: 'mwanake ngukwira ati wendo ni wendo, utumage mundu oye mukanda\
              ecurie, erute mwoyo niundu wa mundu ungi.',
    Permissions: 'Private',
    CreatedAt: new Date(Date.now() + 5),
    Permissions: 'Private'
  },
  {
    title: 'Board games',
    content: 'Sixty seconds, Monopoly, Cashflow, Scrabble, Chess, Draft,\
              Family Feud',
    Owner: 'ganjez',
    CreatedAt: new Date(Date.now() + 6),
    Permissions: 'Public'
  },
  {
    title: 'Brands',
    content: 'Louis Vuitton, Gucci',
    CreatedAt: new Date(Date.now() + 7),
    Permissions: 'Private',
  },
  {
    title: 'Car Models',
    content: 'Ferrari, Bugatti, Chrysler, Runx, Rolls Royce, Mercedes Benz, BMW',
    CreatedAt: new Date(Date.now() + 8),
    Permissions: 'Public'
  }
]
module.exports = TestDocuments;
