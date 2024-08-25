class ChallengeApiClient {
  static SERVER_URL = "http://localhost:8080";
  static GET_CHALLENGE = "/challenges/random";
  static POST_RESULT = "/attempts";
  static GET_ATTEMPTS_BY_ALIAS = "/attempts?userAlias=";
  static GET_USERS_BY_IDS = "/users";
  static challenge() {
    return fetch(
      ChallengeApiClient.SERVER_URL + ChallengeApiClient.GET_CHALLENGE
    );
  }
  static sendGuess(user, a, b, guess) {
    const json = JSON.stringify({
      userAlias: user,
      factorA: a,
      factorB: b,
      guess: guess,
    });
    console.log(`sending json ${json}`);
    return fetch(
      ChallengeApiClient.SERVER_URL + ChallengeApiClient.POST_RESULT,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: json,
      }
    );
  }
  static getAttempts(userAlias) {
    return fetch(
      ChallengeApiClient.SERVER_URL +
        ChallengeApiClient.GET_ATTEMPTS_BY_ALIAS +
        userAlias,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  static getUsers(userIds) {
    return fetch(
      ChallengeApiClient.SERVER_URL +
        ChallengeApiClient.GET_USERS_BY_IDS +
        "/" +
        userIds.join(",")
    );
  }

  static foo() {
    let myPromise = new Promise(function (myResolve, myReject) {
      setTimeout(function () {
        myResolve("I love You !!");
      }, 3000);
    });

    myPromise.then(function (value) {
      document.getElementById("demo").innerHTML = value;
    });
  }
}
export default ChallengeApiClient;
