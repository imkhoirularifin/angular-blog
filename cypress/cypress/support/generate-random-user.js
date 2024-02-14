// generate random user with prefix test
export default function GenerateRandomUser() {
	// Generate a random number between 0 and 999
	const randomNumber = Math.floor(Math.random() * 1000);
	const user = `test_user_${randomNumber}`;
	return user;
}
