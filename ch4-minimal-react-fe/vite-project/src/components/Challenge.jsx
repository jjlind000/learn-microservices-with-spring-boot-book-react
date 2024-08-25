import * as React from "react";
import ChallengeApiClient from "../services/ChallengeApiClient";
import LastAttempts from "./LastAttempts";
import LeaderBoard from "./LeaderBoard";
class Challenge extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      a: "",
      b: "",
      user: "",
      message: "",
      guess: 0,
      lastAttempts: [],
    };
    this.handleSubmitResult = this.handleSubmitResult.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }
  componentDidMount() {
    ChallengeApiClient.challenge().then((res) => {
      if (res.ok) {
        res.json().then((json) => {
          this.setState({
            a: json.factorA,
            b: json.factorB,
          });
        });
      } else {
        this.updateMessage("Can't reach the server");
      }
    });
  }
  handleChange(event) {
    const name = event.target.name;
    this.setState({
      [name]: event.target.value,
    });
  }
  handleSubmitResult(event) {
    event.preventDefault();
    ChallengeApiClient.sendGuess(
      this.state.user,
      this.state.a,
      this.state.b,
      this.state.guess
    ).then((res) => {
      if (res.ok) {
        res.json().then((json) => {
          if (json.correct) {
            this.updateMessage("Congratulations! Your guess is correct");
          } else {
            this.updateMessage(
              `Oops! Your guess ${json.guess} is wrong, but keep playing!`
            );
          }
          this.updateLastAttempts(this.state.user); // NEW!
          this.refreshChallenge(); // NEW!
        });
      } else {
        this.updateMessage("Error: server error or not available");
      }
    });
  }
  refreshChallenge() {
    ChallengeApiClient.challenge().then((res) => {
      if (res.ok) {
        res.json().then((json) => {
          this.setState({
            a: json.factorA,
            b: json.factorB,
          });
        });
      } else {
        this.updateMessage("Can't reach the server");
      }
    });
  }
  updateLastAttempts(userAlias) {
    ChallengeApiClient.getAttempts(userAlias).then((res) => {
      if (res.ok) {
        let attempts = [];
        res.json().then((data) => {
          data.forEach((item) => {
            attempts.push(item);
          });
          this.setState({
            lastAttempts: attempts,
          });
        });
      }
    });
  }
  updateMessage(m) {
    this.setState({
      message: m,
    });
  }
  render() {
    return (
      <div className="display-column">
        <div>
          <h3>Your new challenge is</h3>
          <h1>
            {this.state.a} x {this.state.b}
          </h1>
        </div>
        <form onSubmit={this.handleSubmitResult}>
          <label>
            Your alias:
            <input
              type="text"
              maxLength="12"
              name="user"
              value={this.state.user}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <label>
            Your guess:
            <input
              type="number"
              min="0"
              name="guess"
              value={this.state.guess}
              onChange={this.handleChange}
            />
          </label>
          <br />
          <input type="submit" value="Submit" />
        </form>
        <h4>{this.state.message}</h4>
        {this.state.lastAttempts.length > 0 && (
          <LastAttempts lastAttempts={this.state.lastAttempts} />
        )}

        <LeaderBoard />
      </div>
    );
  }
}
export default Challenge;
