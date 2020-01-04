import React, {Component} from "react";
import ReactDOM from "react-dom";

class App extends Component {
    render() {
        return (
            <div className={"user__bg"}>
                <Users/>
            </div>
        )
    }
}

class Users extends Component {
    // update = (data) => {
    //     this.setState({name: data,
    //         surname: data,
    //         dailyTime: data,
    //         totalTime: data})
    // };
    state = {
      users : []
    };
    render() {
        return (<>
                <AddUser/>
                <UserList />
            </>
        )
    }
}

class AddUser extends Component {
    state = {
        show: false
    };
    toggle = () => {
        this.setState({show: !this.state.show})
    };
    showForm = (e) => {
        e.preventDefault();
        this.toggle();
    };

    render() {
        if (this.state.show) {
            return (
                <>
                    <button className={"user__toggleFormBtn"} onClick={this.showForm}>+</button>
                    <AddUserForm/>
                </>
            )
        } else {
            return <button className={"user__toggleFormBtn"} onClick={this.showForm}>+</button>
        }
    }
}

class AddUserForm extends Component {
    state = {
        name: "",
        surname: "",
        dailyTime: 0,
        totalTime: 0
    };

    inputHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    add = (e) => {
        e.preventDefault();
    };
    render() {
        return (
            <form className={"user__form"}>
                <label> Imię
                    <input onChange={this.inputHandler} name="name" type="text"/>
                </label>
                <label> Nazwisko
                    <input onChange={this.inputHandler} name="surname" type="text"/>
                </label>
                <label> Wymiar pracy
                    <input onChange={this.inputHandler} name="dailyTime" type="number"/>
                </label>
                <button onSubmit={this.props.add}>Dodaj</button>
            </form>
        )
    }
}

class UserList extends Component {
    render() {
        return (
            <div>
                <h3>{this.props.name} </h3>
                <h3>{this.props.surname}</h3>
                <h4>{this.props.totalTime}</h4>
            </div>
        )
    }
}


ReactDOM.render(<App/>, document.getElementById("app"));
