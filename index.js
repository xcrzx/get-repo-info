import axios from "axios";
const repositoryName = process.argv[2];
if (!repositoryName) {
    console.error("Missing repository name");
    process.exit(1);
}
const repositoryUrl = `https://api.github.com/repos/${repositoryName}`;
const [repositoryResponse, statsResponse, commitsResponse] = await Promise.all([
    axios.get(repositoryUrl),
    axios.get(`${repositoryUrl}/stats/participation`),
    axios.get(`${repositoryUrl}/commits`),
]);
const totalCommitsCount = statsResponse.data.all.reduce((acc, cur) => acc + cur, 0);
const averageCommitsPerWeek = totalCommitsCount / statsResponse.data.all.length;
const lastThreeCommits = commitsResponse.data
    .slice(0, 3)
    .map((commit) => commit.commit.message.match(/^.*$/m)[0])
    .join("\n");
console.log(`Commits per week: ${averageCommitsPerWeek}
Number of stars: ${repositoryResponse.data.stargazers_count}
Last three commits: 
${lastThreeCommits}`);
