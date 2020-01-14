import React, {Component} from "react";
import ReactDOM from "react-dom";
import Calendar from 'react-calendar';

class App extends Component {
    // getUsers = (users) => {
    //     this.setState({users: users})
    // };

    render() {
        return (
            <div className={"app"}>
                <AppContainer/>
            </div>)
    }
}

class AppContainer extends Component {
    state = {
        users: []
    };

    render() {
        return (
            <div className={"appContainer"}>
                <CalendarToggle/>
                <Users/>
            </div>
        )
    }
}

class CalendarToggle extends Component {
    state = {
        show: true
    };
    toggle = () => {
        this.setState({show: !this.state.show})
    };
    showCalendar = (e) => {
        e.preventDefault();
        this.toggle();
    };

    render() {
        if (this.state.show) {
            return (
                <>
                    <div className={"calendarToggle"}>
                        <button onClick={this.showCalendar} className={"calendarToggleBtn"}></button>
                    </div>
                    <CalendarPart/>
                </>
            )
        } else {
            return (
                <div className={"calendarToggle"}>
                    <button onClick={this.showCalendar} className={"calendarToggleBtn"}></button>
                </div>
            )
        }
    }
}

class CalendarPart extends Component {
    state = {
        date: new Date(),
    };
    onChange = date => this.setState({date});

    render() {
        return (
            <div className={"calendarPart"}>
                <Calendar
                    onChange={this.onChange}
                    value={this.state.date}/>
                <CalendarEvents date={this.state.date}/>
            </div>
        );
    }
}

class CalendarEvents extends Component {
    render() {
        return (
            <div className={"calendarEvents"}>
                <CalendarDate date={this.props.date}/>
                <AddEvent date={this.props.date}/>
                <CalendarEventList date={this.props.date}/>
            </div>
        )
    }
}

class CalendarDate extends Component {
    state = {
        date: "",
    };
    formatDate = () => {
        const day = this.props.date.toLocaleDateString().split(`.`)[0];
        const dayNames = [
            "Niedz",
            "Pon",
            "Wt",
            "Śr",
            "Czw",
            "Pt",
            "Sob"
        ];
        const name = dayNames[this.props.date.getDay()];
        return (
            <div className={"calendarDate"}>
                <h2>{name}</h2>
                <h3>{day}</h3>
            </div>
        )
    };

    render() {
        return (
            <div>{this.formatDate()}</div>
        )
    }
}

class AddEvent extends Component {
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
                    <button className={"addEventBtn"} onClick={this.showForm}></button>
                    <EventForm date={this.props.date}/>
                </>
            )
        } else {
            return <button className={"addEventBtn"} onClick={this.showForm}></button>
        }
    }
}

class EventForm extends Component {
    state = {
        date: "",
        inPlus: "",
        inMinus: "",
        count: 0,
        users: []
    };
    setDate = () => {
        const date = this.props.date.toLocaleDateString();
        this.setState({date: {date}})
    };
    selectPerson1 = () => {
        return this.state.users.map((el) => {
            return (
                <option key={el} value={el.name + el.surname}> {el.name} {el.surname}</option>
            )
        })
    };
    selectPerson2 = () => {
        return this.state.users.map((el) => {
            return (
                <option key={el}> {el.name} {el.surname}</option>
            )
        })
    };
    inputHandler = (e) => {
        this.setState({[e.target.name]: e.target.value})
    };
    hoursHandler = (e) => {
        this.setDate();
        this.setState({[e.target.name]: e.target.value})
    };
    submitHandler = (e) => {
        if (this.state.inPlus === this.state.inMinus) {
            e.preventDefault();
            alert("Pola osoby zastępującej i zastępowanej nie mogą mieć tej samej wartości")
        }
        if ((this.state.count === "") || (this.state.count <= 0)) {
            e.preventDefault();
            alert("Pole godzin nie może być puste ani mniejsze od 0!")
        } else {
            e.preventDefault();
            db.collection(`sub`).add(this.state);
            alert("Dodano nowe zastępstwo!")
        }
    };

    render() {
        return (
            <>
                <form onSubmit={this.submitHandler} className={"eventForm"}>
                    <label className={"eventFormLabel"}>Osoba zastępowana
                        <select name="inMinus" className={"eventFormSct"} onChange={this.inputHandler}>
                            <option value="" disabled selected hidden>Wybierz pracownika</option>
                            {this.selectPerson1()}
                        </select>
                    </label>
                    <input name="count" className={"eventFormInput"} onChange={this.hoursHandler}
                           placeholder="Ile godzin?">
                    </input>
                    <label className={"eventFormLabel"}>Osoba zastępująca
                        <select name="inPlus" className={"eventFormSct"} onChange={this.inputHandler}>
                            <option value="" disabled selected hidden>Wybierz pracownika</option>
                            {this.selectPerson2()}
                        </select>
                    </label>
                    <button type="submit" className={"eventFormBtn"}>Zatwierdź</button>
                </form>
            </>
        )
    }

    componentDidMount() {
        db.collection(`users`).get().then((el) => {
                el.docs.map((doc) => {
                    return this.setState({
                        users: this.state.users.concat(doc.data())
                    });
                })
            }
        );
    }
}

class CalendarEventList extends Component {
    state = {
        sub: []
    };
    dayEvents = () => {
        let selectedDate = this.props.date.toLocaleDateString();
        return this.state.sub.map((el) => {
            if (el.data().date.date === selectedDate) {
                return (
                    <ul>
                        <li>
                            <div data-id={el.id}>
                                <div>{el.data().date.date}</div>
                                <div>{el.data().inMinus}</div>
                                <div>{el.data().count}</div>
                                <div>{el.data().inPlus}</div>
                                <button onClick={this.eventDel} className={"eventFormBtnDel"}>Usuń</button>
                            </div>
                        </li>
                    </ul>
                )
            }
        });
    };
    eventDel = (e) => {
        const eventId = e.target.parentElement.getAttribute("data-id");
        db.collection(`sub`).doc(eventId).delete();
        e.target.parentElement.remove();
        this.render()
    };

    render() {
        return (
            <>
                {this.dayEvents()}
            </>
        )
    }

    componentDidMount() {
        db.collection(`sub`).get().then((el) => {
            el.docs.map((doc) => {
                this.setState({
                    sub: this.state.sub.concat(doc),
                });
            })
        })
    }
}

class Users extends Component {
    render() {
        return (
            <div className={"users"}>
                <UsersPanel/>
            </div>
        )
    }
}

class UsersPanel extends Component {
    state = {
        workingDays: 0
    };
    passWorkingDays = (days) => {
        this.setState({workingDays: days})
    };

    render() {
        return (
            <div className={"usersPanel"}>
                <WorkingDays update={this.passWorkingDays}/>
                {/*<UsersFilter/>*/}
                <AddUser workingDays = {this.state.workingDays}/>
            </div>
        )
    }
}

class WorkingDays extends Component {
    state = {
        show: false,
        workingDays: 0
    };
    inputHandler = (e) => {
        this.setState({[e.target.name]: e.target.value});
        this.props.update(this.state.workingDays)

    };
    showInput = () => {
        this.setState({show: !this.state.show})
    };

    render() {
        if (this.state.show) {
            return (
                <div className={"workingDays"}>
                    <div onClick={this.showInput} className={"workingDaysVal"}>{this.state.workingDays}</div>
                    <input type="number" name="workingDays" onChange={this.inputHandler}/>
                </div>
            )
        } else {
            return (
                <div className={"workingDays"}>
                    <div onClick={this.showInput} className={"workingDaysVal"}>{this.state.workingDays}</div>
                </div>
            )
        }
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
                    <button className={"addUser"} onClick={this.showForm}></button>
                    <AddUserForm workingDays = {this.props.workingDays}/>
                    <UserList/>
                </>
            )
        } else {
            return (
                <>
                    <button className={"addUser"} onClick={this.showForm}></button>
                    <UserList/>
                </>
            )
        }
    }
}

class AddUserForm extends Component {
    state = {
        name: "",
        surname: "",
        dailyTime: 0,
        totalTime: 0,
        subs: [],
    };
    countTotal = () => {
        let total = this.state.dailyTime*this.props.workingDays;
      return this.setState({ totalTime : {total}})
    };
    inputHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
        this.countTotal();
    };
    clearForm = () => {
        document.querySelector("name").value = "";
        document.querySelector("surname").value = "";
        document.querySelector("dailyTime").value = "";
    };
    add = (e) => {
        e.preventDefault();
        if ((this.state.name === "") || (this.state.surname === "")) {
            return alert("Pola Imię oraz Nazwisko muszą być uzupełnione!")
        } else {
            e.preventDefault();

            db.collection(`users`).add(this.state);
            alert("Dodano nowego użytkownika!");
            this.clearForm();
        }
    };

    render() {
        return (
            <form className={"addUserForm"} onSubmit={this.add}>
                <label className={"addUserLabel"}> Imię
                    <input onChange={this.inputHandler} name="name" type="text" id="name" className={"addUserInput"}/>
                </label>
                <label className={"addUserLabel"}> Nazwisko
                    <input onChange={this.inputHandler} name="surname" type="text" id="surname"
                           className={"addUserInput"}/>
                </label>
                <label className={"addUserLabel"}> Wymiar pracy
                    <input onChange={this.inputHandler} name="dailyTime" type="number" id="dailyTime"
                           className={"addUserInput"}/>
                </label>
                <button className={"addUserBtn"} type="submit">Dodaj</button>
            </form>
        )
    }
}

class UserList extends Component {
    state = {
        users: [],
        showMore: false
    };
    // edit = () => {
    //     let id  = e.target.closest("li").getAttribute("data-id");
    //     db.collection(`users`).doc(id).update();
    // };
    delete = (e) => {
        let id = e.target.closest("li").getAttribute("data-id");
        e.target.closest("li").remove();
        db.collection(`users`).doc(id).delete();
    };
    showMore = (e) => {
        e.preventDefault();
        this.setState({showMore: !this.state.showMore});
    };
    renderUsers = () => {
        return this.state.users.map((el) => {
            if (this.state.showMore) {
                return (
                    <li key="el" data-id={el.id} className={"userListEl"}>
                        <div className={"userListName"}>{el.data().name}</div>
                        <div className={"userListSurname"}>{el.data().surname}</div>
                        <div className={"userListCount"}>{el.data().totalTime}</div>
                        <button className={"userListBtn"} onClick={this.showMore}>Pokaż więcej</button>
                        <button className={"userListDelete"} onClick={this.delete}>Delete</button>
                    </li>
                )
            } else {
                return (
                    <li key="el" data-id={el.id} className={"userListEl"}>
                        <div className={"userListName"}>{el.data().name}</div>
                        <div className={"userListSurname"}>{el.data().surname}</div>
                        <div className={"userListCount"}>{el.data().totalTime}</div>
                        <table className={"userListTab"}>
                            <thead>
                            <tr>
                                <td>Date</td>
                                <td>Count</td>
                                <td>inMinus => inPlus</td>
                            </tr>
                            </thead>
                            <tbody>
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                            </tbody>
                        </table>
                        <button className={"userListBtn"} onClick={this.showMore}>Pokaż mniej</button>
                        <button className={"userListDelete"} onClick={this.delete}>Delete</button>
                    </li>
                )

            }
        });
    };

    render() {
        return (
            <div className={"user__tile__list"}>
                <ul>
                    {this.renderUsers()}
                </ul>
                {/*<User users = {this.state.users} />*/}
            </div>
        )
    }

    componentDidMount() {
        const collection = db.collection(`users`).get().then((el) => {
                el.docs.map((doc) => {
                    this.setState({
                        users: this.state.users.concat(doc),
                    });
                })
            }
        );
    }
}

// class User extends Component {
//     renderUsers = () => {
//             return (
//                 <li key="el" data-id={this.props.users.id} className={"userListEl"}>
//                     <div className={"userListName"}>{this.props.users.data().name}</div>
//                     <div className={"userListSurname"}>{this.props.users.data().surname}</div>
//                     <div className={"userListCount"}>{this.props.users.data().totalTime}</div>
//                     <button className={"userListBtn"} onClick={"this.showMore"}>Pokaż więcej</button>
//                     <button className={"userListDelete"} onClick={this.delete}>Delete</button>
//                 </li>
//             )
//     };
//
//     render() {
//         return (
//             <div>
//
//                     {this.renderUsers()}
//
//             </div>
//         );
//     }
//
// }


ReactDOM
    .render(
        <App/>,
        document
            .getElementById(
                "app"
            ))
;