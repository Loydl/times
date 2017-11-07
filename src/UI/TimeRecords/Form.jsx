import React, { Component } from 'react';
import fire from '../../utils/fire';

export default class Form extends Component {

    constructor() {
        super();

        this.state = {
            description: '',
            project: '',
            startTime: '',
            endTime: '',
            date: '',
            error: null
        }
    }


    handleSubmit(e) {
        e.preventDefault();
        const { description, project, startTime, endTime, date } = this.state;

        const timeRecordsRef = fire.database().ref('timeRecords').child(this.props.user.uid).push();

        timeRecordsRef.set({
            description,
            project,
            startTime,
            endTime,
            date
        })
    }

    render() {
        return(
            <form onSubmit={this.handleSubmit.bind(this)}>
                <div className="form-row">
                    <div className="form-group col-md-3">
                        <label htmlFor="description">Description</label>
                        <input type="text" className="form-control" id="description" required value={this.state.description} onChange={e => this.setState({ description: e.target.value })}/>
                    </div>
                    <div className="form-group col-md-2">
                        <label htmlFor="project">Project</label>
                        <input type="text" className="form-control" id="project" required value={this.state.project} onChange={e => this.setState({ project: e.target.value })}/>
                    </div>
                    <div className="form-group col-md-2">
                        <label htmlFor="startTime">Start Time</label>
                        <input type="time" className="form-control" id="startTime" required value={this.state.startTime} onChange={e => this.setState({ startTime: e.target.value })}/>
                    </div>
                    <div className="form-group col-md-2">
                        <label htmlFor="endTime">End Time</label>
                        <input type="time" className="form-control" id="endTime" required value={this.state.endTime} onChange={e => this.setState({ endTime: e.target.value })}/>
                    </div>
                    <div className="form-group col-md-2">
                        <label htmlFor="date">Date</label>
                        <input type="date" className="form-control" id="date" required value={this.state.date} onChange={e => this.setState({ date: e.target.value })}/>
                    </div>
                    <div className="form-inline col-md-1">
                        <button className="btn btn-primary" type="submit">Submit</button>
                    </div>
                </div>
                { this.state.error ? <div className="alert alert-danger">{ this.state.error.message }</div> : null}
            </form>
        )
    }
}