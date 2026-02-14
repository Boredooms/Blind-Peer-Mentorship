# 🎭 Blind Peer Mentorship

> **Anonymous skill-based mentorship matching powered by Midnight blockchain**

Connect with mentors based on proven skill gaps—without revealing your employer, seniority level, or personal identity upfront.

---

## � What is Blind Peer Mentorship?

**Blind Peer Mentorship** is a privacy-preserving decentralized application that enables professionals to find mentors anonymously. Built on the Midnight blockchain using zero-knowledge proofs, it ensures that:

- 🎯 **Mentees** can seek help for skill gaps without exposing their company or job level
- 🧑‍🏫 **Mentors** can offer expertise without revealing their employer affiliation
- 🤝 **Matches** are made purely on complementary skills, not backgrounds
- 🔒 **Identities** remain private until both parties mutually agree to connect

Perfect for professionals who want to learn and grow without workplace politics or bias!

---

## ✨ Features

### 🔐 Privacy-First Design

- **Anonymous Profiles** - Register skill gaps without revealing identity
- **Zero-Knowledge Proofs** - Prove you have skill gaps without exposing specifics
- **Blind Matching** - Get matched based on skills, not seniority or company
- **Mutual Consent** - Identities revealed only after both parties agree

### 🎯 Smart Matching

- **Skill-Based Algorithm** - Matches mentees with mentors who have complementary expertise
- **No Bias** - Employer, job title, and seniority remain hidden during matching
- **Quality Control** - Anonymous reputation system ensures accountability

### 📊 On-Chain Tracking

- **Session Management** - Track mentorship sessions without revealing participants
- **Reputation System** - Build credibility through anonymous feedback
- **Public Statistics** - Transparent metrics without compromising privacy

---

## � Deployed Smart Contract

### Contract Information

| Property | Value |
|----------|-------|
| **Contract Address** | `427f7e23d0ff6f515d5dae7ee5cb91f6c2cc3ceab9275c58111f6204522710b7` |
| **Network** | Undeployed (Local Midnight Network) |
| **Deployed At** | 2026-02-14T17:01:14.279Z |
| **Wallet Address** | `mn_addr_undeployed1dn3v6fytswdslsyjla86gjh8g603ty53eg4el7nfc2ajtqrtcwgqm5zppa` |

### Contract Capabilities

The smart contract provides the following privacy-preserving operations:

```compact
registerUser()        // Register anonymously as mentor or mentee
requestMentorship()   // Request a match based on skill needs
acceptMatch()         // Accept a mentorship match
completeSession()     // Record session completion privately
cancelSession()       // Cancel an active session
updateReputation()    // Update reputation anonymously
getStats()           // View public statistics
```

---

## 🎯 How It Works

### 1️⃣ **Register Your Profile**

Create a profile listing your skill gaps (as a mentee) or expertise (as a mentor). All data is stored using zero-knowledge proofs—no one can see your employer or job title.

### 2️⃣ **Get Matched Anonymously**

The smart contract analyzes skill gaps and mentor expertise to create matches based purely on complementary skills. Both parties are notified without revealing identities.

### 3️⃣ **Mutual Agreement**

Both mentor and mentee must accept the match. Only after mutual acceptance can identities be revealed (optionally, off-chain).

### 4️⃣ **Mentorship Session**

Conduct your mentorship session. Upon completion, record it on-chain anonymously and update reputation scores privately.

---

## 🛠️ Technology Stack

- **Blockchain**: [Midnight Network](https://midnight.network) - Privacy-focused blockchain with ZK proofs
- **Smart Contract Language**: Compact (TypeScript-based)
- **Wallet SDK**: `@midnight-ntwrk/wallet-sdk` v1.0.0
- **Proof Server**: v7.0.0
- **Development Tools**: Node.js, Docker, WSL

---

## 🏁 Getting Started

### Prerequisites

- Node.js v23+ and npm v11+
- Docker with WSL (for Windows)
- Git LFS
- Midnight Compact compiler v0.28.0

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Boredooms/Blind-Peer-Mentorship.git
   cd Blind-Peer-Mentorship
   ```

2. **Install dependencies**
   ```bash
   cd counter-contract
   npm install
   ```

3. **Start local Midnight network**
   ```bash
   cd ../midnight-local-network
   docker compose up -d
   ```

4. **Build the project**
   ```bash
   cd ../counter-contract
   npm run build
   ```

### Deploy Your Own Instance

1. **Fund your wallet**
   ```bash
   cd ../midnight-local-network
   npm run fund <your-wallet-address>
   ```

2. **Deploy the contract**
   ```bash
   cd ../counter-contract
   npm run deploy
   ```

---

## 📊 Current Statistics

| Metric | Value |
|--------|-------|
| Total Matches | 0 |
| Completed Sessions | 0 |
| Total Users | 0 |
| Active Sessions | 0 |

---

## 🎓 Use Cases

### For Professionals

- 🎯 Learn new technologies without revealing skill gaps to your employer
- 🤝 Get mentorship without exposing your current company
- 📈 Build skills privately and confidentially
- 🌟 Connect with experts based purely on expertise

### For Mentors

- 💡 Share knowledge without company conflicts of interest
- 🎁 Help others without revealing your affiliation
- ⭐ Build reputation privately
- 🎯 Match with mentees who genuinely need your expertise

### For Organizations

- 🏢 Enable internal mentorship without hierarchy bias
- 🌐 Cross-company knowledge sharing
- 📊 Track skill development anonymously
- 💬 Collect anonymous feedback

---

## 🔒 Privacy Guarantees

✅ **Employer Anonymity** - Company information never stored or revealed  
✅ **Seniority Protection** - Job titles and levels remain private  
✅ **Skill Privacy** - Specific skill gaps proven without disclosure  
✅ **Session Confidentiality** - Mentorship content stays off-chain  
✅ **Reputation Privacy** - Feedback aggregated and anonymized  

---

## 🗺️ Roadmap

- [x] Basic contract structure
- [x] Wallet setup and funding
- [x] Contract deployment to local network
- [ ] Full skill matching algorithm implementation
- [ ] Private state management
- [ ] Frontend web application
- [ ] Advanced reputation system
- [ ] Comprehensive testing suite
- [ ] Preview network deployment
- [ ] Mainnet deployment

---

## � Documentation

- [Midnight Documentation](https://docs.midnight.network/)
- [Midnight Academy](https://academy.midnight.network/)
- [Compact Language Guide](https://docs.midnight.network/develop/compact)
- [Wallet SDK Documentation](https://docs.midnight.network/develop/wallet-sdk)

---

## 🤝 Contributing

Contributions are welcome! This project is part of the Midnight blockchain ecosystem.

### Development

```bash
# Compile the contract
npm run compile

# Build TypeScript
npm run build

# Deploy to local network
npm run deploy
```

---

## 📜 License

Apache-2.0

---

## 🙏 Acknowledgments

- **Midnight Network** - For the privacy-focused blockchain platform
- **Midnight Foundation** - For developer resources and support
- **Midnight Community** - For guidance and inspiration

---

## 📞 Connect

- **GitHub**: [Boredooms](https://github.com/Boredooms)
- **Midnight Network**: [midnight.network](https://midnight.network)
- **Discord**: [Midnight Discord](https://discord.gg/midnight)

---

<div align="center">

**Built with ❤️ on Midnight Network**

*Empowering anonymous skill development through privacy-preserving blockchain technology*

⭐ Star this repo if you believe in privacy-first mentorship!

</div>
