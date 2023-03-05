export const projects = [
  {
    id: 1,
    title: "Binge Time",
    overview:
      "Binge Time is an app I developed as a TV series enthusiast and self-proclaimed binge watcher to help people discover their next favorite TV show or movie. By inputting their favorite show/movie and country, users can get personalized recommendations with direct links to watch on Netflix if available. The app also displays important details such as IMDb ratings and plot summaries. With Binge Time, finding new content to enjoy is simple and efficient.",
    features: [
      "Personalized recommendations based on user preferences via ChatGPT API",
      "Netflix availability check based on user's country",
      "Interactive animations using Framer Motion for a more engaging user experience",
      "Display of IMDb information of the selected TV show or movie",
    ],
    tech: ["React", "Nextjs", "TailwindCSS", "ChatGPT"],
    image: "binge",
    links: [
      "https://binge-time.vercel.app",
      "https://github.com/nhestrompia/binge-time",
    ],
  },
  {
    id: 2,
    title: "zkBlackjack",
    overview:
      "zkBlackjack is a decentralized application (dApp) that provides a secure and enjoyable platform for playing blackjack. Built on the Ethereum Goerli Testnet, the game incorporates zero knowledge proofs to protect player hands and reduce the risk of card counting. ",
    features: [
      "Trustless platform for playing blackjack without relying on intermediaries",
      "Using zero-knowledge proofs, player hands are secured and the risk of card counting is prevented, ensuring privacy protection.",
      "Multiplayer and single player options",
      "User-friendly interface for easy navigation and gameplay",
    ],
    tech: [
      "React",
      "Nextjs",
      "TailwindCSS",
      "Nodejs",
      "Socketio",
      "Solidity",
      "Ethersjs",
      "Hardhat",
    ],
    image: "zkblackjack",
    links: ["", ""],
  },
  {
    id: 3,
    title: "Fautor",
    overview:
      "This proof-of-concept decentralized application (dApp) enables creators to monetize their content through recurring payments and unique gateway NFTs for each tier in their plans. Fautor uses a script to handle recurring payments securely on-chain.",
    features: [
      "Simple and efficient recurring payments without external protocols",
      "Creation of multiple plans with up to 4 unique tiers, each with their own price and NFTs",
      "Creators can easily upload images for each tier individually, and the images are automatically deployed to IPFS for seamless access and sharing",
      "Option for accepting donations through ERC20 tokens and ETH",
    ],
    tech: [
      "React",
      "Nextjs",
      "TailwindCSS",
      "mongoDB",
      "Solidity",
      "Ethersjs",
      "Hardhat",
    ],
    image: "fautor",
    links: ["", ""],
  },
  ,
]
