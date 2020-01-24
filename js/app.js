import React, {Component} from "react";
import ReactDOM from "react-dom";
import Calendar from 'react-calendar';

class App extends Component {
    render() {
        return (
            <div className={"app"}>
                <div className={"appHeader"}>
                    <div className={"appHeaderContainer"}>
                        <h1 className={"appLogo"}> Calendar Calc</h1>
                    </div>
                </div>
                <AppContainer/>
                <div className={"appFooter"}> tkmatuszewski &copy;2020</div>
            </div>)
    }
}

class AppContainer extends Component {
    state = {
        key: 0
    };
    liveR = () => {
        this.setState({
            key: Math.random()
        });
    };

    render() {
        return (
            <div className={"appContainer"}>
                <CalendarToggle liveR={this.liveR}/>
                <UserPart/>
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
                    <div className={"calendarToggle"} onClick={this.showCalendar}>
                        <div className={"calendarToggleIconHide"}/>
                    </div>
                    <CalendarPart liveR={this.props.liveR}/>
                </>
            )
        } else {
            return (
                <div className={"calendarToggle"} onClick={this.showCalendar}>
                    <div className={"calendarToggleIconShow"}/>
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
    tileContent = (date, view) => {
        if (view === `month` && date.getDay() === 0) {
            return console.log('date');
        }
    };

    render() {
        return (
            <div className={"calendarPart"}>
                <Calendar
                    onChange={this.onChange}
                    value={this.state.date}/>
                <CalendarEvents date={this.state.date} tileContent={this.tileContent}/>
            </div>
        );
    }
}

class CalendarEvents extends Component {
    state = {
        key: 0
    };
    onAdded = () => {
        this.setState({
            key: Math.random()
        });
    };

    render() {
        return (
            <div className={"calendarEvents"}>
                <div className={"calendarEventsCnt"}>
                    <CalendarDate date={this.props.date}/>
                    <AddEvent date={this.props.date} onAdded={this.onAdded}
                              liveR={this.props.liveR} tileContent={this.tileContent}/>
                    <CalendarEventList date={this.props.date} key={this.state.key}/>
                </div>
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
    passToggle = (state) => {
        this.setState({show: state})
    };

    render() {
        if (this.state.show) {
            return (
                <>
                    <button className={"addEventBtn"} onClick={this.showForm}>Dodaj zastępstwo</button>
                    <EventForm date={this.props.date} hide={this.passToggle} onAdded={this.props.onAdded}
                               liveR={this.props.liveR}/>
                </>
            )
        } else {
            return <button className={"addEventBtn"} onClick={this.showForm}>Dodaj zastępstwo</button>
        }
    }
}

//poprawić select
class EventForm extends Component {
    state = {
        date: "",
        inPlus: "",
        inMinus: "",
        count: 0,
        show: true,
        users: []
    };
    setDate = () => {
        const date = this.props.date.toLocaleDateString();
        this.setState({date: date})
    };
    selectPerson1 = () => {
        return this.state.users.map((el) => {
            return (
                <option key={Math.random()} value={el.fullName}>{el.fullName}</option>
            )
        })
    };
    selectPerson2 = () => {
        return this.state.users.map((el) => {
            return (
                <option key={Math.random()} value={el.fullName}>{el.fullName}</option>
            )
        })
    };
    inputHandler = (e) => {
        this.setState({[e.target.name]: e.target.value});
    };
    hoursHandler = (e) => {
        this.setState({[e.target.name]: e.target.value});
        this.setDate()
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
            this.props.onAdded();
            this.setState({show: false});
            this.props.hide();
            db.collection(`sub`).add(this.state);
            alert("Dodano nowe zastępstwo!");
            this.props.liveR();
            this.props.tileContent(this.state.date, month);
        }
    };
    closeForm = () => {
        this.setState({show: false});
        this.props.hide();
    };

    render() {
        return (
            <div className={"eventFormContainer"}>
                <form onSubmit={this.submitHandler} className={"eventForm"}>
                    <label className={"eventFormLabel"}>Osoba zastępowana
                        <select name="inMinus" className={"eventFormSct"} onChange={this.inputHandler}>
                            <option value="" selected="selected">Wybierz pracownika</option>
                            <option value="Inne">Inne</option>
                            {this.selectPerson1()}
                        </select>
                    </label>
                    <label className={"eventFormLabel"}>Osoba zastępująca
                        <select name="inPlus" className={"eventFormSct"} onChange={this.inputHandler}>
                            <option value={"Wybierz pracownika"}>Wybierz pracownika</option>
                            {this.selectPerson2()}
                        </select>
                    </label>
                    <input name="count" className={"eventFormInput"} onChange={this.hoursHandler}
                           placeholder="Ile godzin?">
                    </input>
                    <button type="submit" className={"eventFormBtn"}>Zatwierdź</button>
                </form>
                <button className={"eventFormClose"} onClick={this.closeForm}/>
            </div>
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
            if (el.data().date === selectedDate) {
                return <Event event={el} key={Math.random()}/>
            }
        });
    };

    render() {
        return (
            <>
                <ul className={"calendarEventList"}>
                    {this.dayEvents()}
                </ul>
            </>
        )
    }

    componentDidMount() {
        console.log("mount");
        db.collection(`sub`).get().then((el) => {
            el.docs.map((doc) => {
                this.setState({
                    sub: this.state.sub.concat(doc),
                });
            })
        })
    }
}

class Event extends Component {
    state = {
        shortInMin: "",
        shortInPls: ""
    };
    eventDelete = (e) => {
        const eventId = e.target.parentElement.getAttribute("data-id");
        db.collection(`sub`).doc(eventId).delete();
        e.target.parentElement.remove();
        this.render()
    };
    // shortenUsers  =()=> {
    //     let name = this.props.event.data();
    //     let shortinMin = name.inMinus.split("");
    //     // shortMin = shortinMin[0][0]+shortinMin[1][0]
    //     console.log(shortinMin);
    //     return shortinMin
    // ;
    render() {
        let event = this.props.event;
        return (
            <li key={event} className={"eventEl"}>
                <div data-id={event.id} className={"eventContainer"}>
                    <div className={"eventUser"}>{event.data().inMinus}</div>
                    <div className={"eventCount"}>{event.data().count}</div>
                    <div className={"eventUser"}>{event.data().inPlus}</div>
                    <button onClick={this.eventDelete} className={"eventDel"}/>
                </div>
            </li>
        )
    }
}

class UserPart extends Component {
    render() {
        return (
            <div className={"userPart"}>
                <UserPanel/>
            </div>
        )
    }
}

class UserPanel extends Component {
    state = {
        businessDays: 0
    };
    passBusinessDays = (days) => {
        this.setState({businessDays: days})
    };

    render() {
        return (
            <div className={"usersContainer"}>
                <div className={"usersPanel"}>
                    <BusinessDays update={this.passBusinessDays}/>
                    {/*<UsersFilter/>*/}
                    <AddUser businessDays={this.state.businessDays}/>
                </div>
            </div>
        )
    }
}

class BusinessDays extends Component {
    state = {
        show: false,
        businessDays: 0
    };
    inputHandler = (e) => {
        this.setState({[e.target.name]: e.target.value});
        this.props.update(e.target.value);
    };
    submitHandler = (e) => {
        e.preventDefault();
        db.collection(`businessDays`).doc("hvcziTCipJEMkNgYIxRt").set(this.state);
        this.setState({show: false});
    };
    showInput = () => {
        this.setState({show: !this.state.show})
    };

    render() {
        if (this.state.show) {
            return (
                <>
                    <div className={"businessDays"} onClick={this.showInput}>
                        <div className={"businessDaysVal"}>
                            <span>{this.state.businessDays}</span>
                        </div>
                    </div>
                    <div>
                        <form onSubmit={this.submitHandler}>
                            <input type="number" name="businessDays" className={"businessDaysInput"}
                                   onChange={this.inputHandler} placeholder={"Dni robocze"}/>
                            <button className={"businessDaysBtn"}>Zatwierdź</button>
                        </form>
                    </div>
                </>
            )
        } else {
            return (
                <div className={"businessDays"} onClick={this.showInput}>
                    <div className={"businessDaysVal"}>{this.state.businessDays}</div>
                </div>
            )
        }
    }

    componentDidMount() {
        db.collection(`businessDays`).doc("hvcziTCipJEMkNgYIxRt").get().then((doc) => {
            this.setState({businessDays: doc.data().businessDays});
            this.props.update(this.state.businessDays);
        });
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
    passShowForm = (state) => {
        this.setState({show: state})
    };

    render() {
        if (this.state.show) {
            return (
                <>
                    <button className={"addUser"} onClick={this.showForm}/>
                    <AddUserForm passShowForm={this.passShowForm}/>
                    <UserList businessDays={this.props.businessDays}/>
                </>
            )
        } else {
            return (
                <>
                    <button className={"addUser"} onClick={this.showForm}/>
                    <UserList businessDays={this.props.businessDays}/>
                </>
            )
        }
    }
}

class AddUserForm extends Component {
    state = {
        name: "",
        surname: "",
        fullName: "",
        nick: "",
        dailyTime: 0,
        totalTime: 0,
        subs: [],
        show: false
    };
    generateNick = () => {
        this.setState({nick: this.state.name[0] + this.state.surname[0]})
    };
    generateFullName = () => {
        this.setState({fullName: this.state.name + " " + this.state.surname})
    };
    countTotal = () => {
        let total = this.state.dailyTime * this.props.businessDays;
        return this.setState({totalTime: {total}})
    };
    inputHandler = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        });
        this.generateNick();
        this.generateFullName();
        this.countTotal();
    };
    clearForm = () => {
        document.querySelector("#name").value = "";
        document.querySelector("#surname").value = "";
        document.querySelector("#dailyTime").value = "";
    };
    add = (e) => {
        e.preventDefault();
        if ((this.state.name === "") || (this.state.surname === "")) {
            return alert("Pola Imię oraz Nazwisko muszą być uzupełnione!")
        } else {
            e.preventDefault();
            this.setState({show: false});
            this.props.passShowForm(this.state.show);
            this.generateFullName();

            db.collection(`users`).add(this.state);
            alert("Dodano nowego użytkownika!");
            this.clearForm();
        }
    };

    render() {
        return (
            <div className={"addUserForm"}>
                <div className={"addUserFormCnt"}>
                    <h3 className={"addUserTitle"}>Nowy użytkownik</h3>
                    <form className={""} onSubmit={this.add}>
                        <label className={"addUserLabel"}> Imię
                            <input onChange={this.inputHandler} name="name" type="text" id="name"
                                   className={"addUserInput"}/>
                        </label>
                        <label className={"addUserLabel"}> Nazwisko
                            <input onChange={this.inputHandler} name="surname" type="text" id="surname"
                                   className={"addUserInput"}/>
                        </label>
                        <label className={"addUserLabel"}> Wymiar pracy
                            <input onChange={this.inputHandler} name="dailyTime" type="number" id="dailyTime"
                                   className={"addUserInput"} placeholder={"W godzinach"}/>
                        </label>
                        <button className={"addUserBtn"} type="submit">Dodaj</button>
                    </form>
                </div>
            </div>
        )
    }
}

class UserList extends Component {
    state = {
        users: [],
    };
    renderUsers = () => {
        return this.state.users.map((el) => {
            return <User user={el} businessDays={this.props.businessDays} key={Math.random()}/>
        })
    };

    render() {
        return (
            <>
                <ul className={"userList"}>
                    {this.renderUsers()}
                </ul>
            </>
        )
    }

    componentDidMount() {
        db.collection(`users`).get().then((el) => {
                el.docs.map((doc) => {
                    this.setState({
                        users: this.state.users.concat(doc),
                    });
                })
            }
        );
    };
}

class User extends Component {
    _isMounted = false;
    state = {
        showMore: false,
        events: [],
        bonusHours: 0
    };
    // edit = () => {
    //     let id  = e.target.closest("li").getAttribute("data-id");
    //     db.collection(`users`).doc(id).update();
    // };
    additionalCount = () => {
        const user = this.props.user.data();
        let counter = 0;
        this.state.events.forEach(event => {
            if (event.inPlus === user.fullName) {
                counter += Number(event.count);
            }
            if (event.inMinus === user.fullName) {
                counter -= Number(event.count);
            }
        });
        this.setState({bonusHours: Number(counter)});
        console.log(this.state.bonusHours);
    };
    delete = (e) => {
        let id = e.target.closest("li").getAttribute("data-id");
        e.target.closest("li").remove();
        db.collection(`users`).doc(id).delete();
    };
    // showMore = (e) => {
    //     e.preventDefault();
    //     this.setState({showMore: !this.state.showMore});
    // };

    render() {
        if (this.state.showMore) {
            return (
                <li key={this.props.surname} data-id={this.props.user.id} className={"user"}>
                    <div className={"userContainer"}>
                        <div className={"userNames"}>
                            <div className={"userName"}>{this.props.user.data().name}</div>
                            <div className={"userSurname"}>{this.props.user.data().surname}</div>
                        </div>
                        <TotalTime businessDays={this.props.businessDays} dailyTime={this.props.user.data().dailyTime}
                                   bonusHours={this.state.bonusHours}/>
                        <div className={"userButtons"}>
                            {/*<button className={"userListBtn"} onClick={this.showMore}>Pokaż więcej</button>*/}
                            <button className={"userDelete"} onClick={this.delete}/>
                        </div>
                    </div>
                </li>
            )
        } else {
            return (
                <>
                    <li key={this.props.surname} data-id={this.props.user.id} className={"user"}>
                        <div className={"userContainer"}>
                            <div className={"userNames"}>
                                <div className={"userName"}>{this.props.user.data().name}</div>
                                <div className={"userSurname"}>{this.props.user.data().surname}</div>
                            </div>
                            <TotalTime businessDays={this.props.businessDays}
                                       dailyTime={this.props.user.data().dailyTime}
                                       bonusHours={this.state.bonusHours}/>
                            <div className={"userButtons"}>
                                {/*<button className={"userListBtn"} onClick={this.showMore}>Pokaż więcej</button>*/}
                                <button className={"userDelete"} onClick={this.delete}/>
                            </div>
                        </div>
                        <div className={"userLowerContainer"}>
                            <UserEvents events={this.state.events} user={this.props.user.data()}/>
                        </div>
                    </li>
                </>
            )
        }
    }

    componentDidMount() {
        this._isMounted = true;
        db.collection(`sub`).get().then((el) => {
                el.docs.map((doc) => {
                    this.setState({events: this.state.events.concat(doc.data())}, () => {
                        this.additionalCount();
                    })
                });
            }
        )
    }

    componentWillUnmount() {
        this._isMounted = false;
    }
}

class TotalTime extends Component {
    render() {
        let totalTime = this.props.businessDays * this.props.dailyTime + this.props.bonusHours;
        console.log(totalTime);
        return <div className={"totalTime"}> {totalTime} </div>
    }
}

class UserEvents extends Component {
    state = {
        count: 0
    };

    render() {
        return this.props.events.map((el) => {
                const user = this.props.user;
                const day = el.date;
                // const date = day.split(".")[0];
                const nameMinus = el.inMinus.split(" ")[0];
                const namePlus = el.inPlus.split(" ")[0];

                if (el.inPlus === user.fullName) {
                    return (
                        <div className={"userEvents"} key={Math.random()}>
                            <div className={"userEventsDate"}>{day}</div>
                            <div className={"userEventsCountPlus"}>+{el.count}</div>
                            <div className={"userEventsInMinus"}>{nameMinus}</div>
                        </div>
                    )
                }
                if (el.inMinus === user.fullName) {
                    return (
                        <div className={"userEvents"} key={Math.random()}>
                            <div className={"userEventsDate"}>{day}</div>
                            <div className={"userEventsCountMinus"}>-{el.count}</div>
                            <div className={"userEventsInMinus"}>{namePlus}</div>
                        </div>
                    )
                }
            }
        );
    }
}

ReactDOM
    .render(
        <App/>,
        document
            .getElementById(
                "app"
            ))
;