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
    render() {
        return (
            <>
                <AddUser/>
                <UserList/>
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
                    <button className={"user__toggleFormBtn"} onClick={this.showForm}></button>
                    <AddUserForm/>
                </>
            )
        } else {
            return <button className={"user__toggleFormBtn"} onClick={this.showForm}></button>
        }
    }
}

class AddUserForm extends Component {
    state = {
        userId : "",
        name: "",
        surname: "",
        dailyTime: 0,
        totalTime: 0,
        extra: 0,
        minus: 0
    };

    inputHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };
    add = (e) => {
        e.preventDefault();
        if ((this.state.name === "") || (this.state.surname === "")) {
            return alert("Pola Imię oraz Nazwisko muszą być uzupełnione!")
        } else {
            db.collection(`users`).add(this.state)
        }
    };

    render() {
        return (
            <form className={"user__form"} onSubmit={this.add}>
                <label> Imię
                    <input onChange={this.inputHandler} name="name" type="text"/>
                </label>
                <label> Nazwisko
                    <input onChange={this.inputHandler} name="surname" type="text"/>
                </label>
                <label> Wymiar pracy
                    <input onChange={this.inputHandler} name="dailyTime" type="number"/>
                </label>
                <button>Dodaj</button>
            </form>
        )
    }
}

class UserList extends Component {
    state = {
        users: [],
    };
    edit =()=>{

    };
    delete =()=> {

    };
    renderUsers = () => {
        return this.state.users.map((el) => {
            return (
                <li data-id = {el.ids}>
                    <div>{el.name}</div>
                    <div>{el.surname}</div>
                    <div>{el.dailyTime}</div>
                    <div>{el.extra}</div>
                    <div>{el.minus}</div>
                    <div>{el.totalTime}</div>
                    <button onClick={this.edit}>Edit</button>
                    <button onClick={this.delete}>Delete</button>
                </li>
            )
        });
    };

    render() {

        return (
            <ul>
                {this.renderUsers()}
            </ul>
        )
    }
    componentDidMount() {
        const collection = db.collection(`users`).get().then((el) => {
                el.docs.forEach(doc => {
                    this.setState({
                        users: this.state.users.concat(doc.data()),
                    });
                })
            }
        );
    }
}




ReactDOM.render(<App/>, document.getElementById("app"));
