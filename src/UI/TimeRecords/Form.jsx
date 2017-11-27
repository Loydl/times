import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { AsyncCreatable, Creatable } from 'react-select';
import { query } from './Table';

const loggedInUser = gql`
    {
        loggedInUser{
            id
        }
    }
`;

const allProjects = gql`
    {
        allProjects {
            name
            id
        }
    }
`;

const addRecord = gql`
    mutation AddRecord($date: String!, $startTime: String!, $endTime: String!, $description: String!, $project: String!, $userId: ID!) {
        createRecord(
            date: $date
            startTime: $startTime
            endTime: $endTime
            description: $description
            project: {
                name: $project
            }
            authorId: $userId
            
        ) {
            id
            date
            startTime
            endTime
            description
            project {
                name
                id
            }
        }
    }
`;

const addRecordWithProjectId = gql`
    mutation addRecordWithProjectId($date: String!, $startTime: String!, $endTime: String!, $description: String!, $projectId: ID!, $userId: ID!) {
        createRecord(
            date: $date
            startTime: $startTime
            endTime: $endTime
            description: $description
            projectId: $projectId
            authorId: $userId

        ) {
            id
            date
            startTime
            endTime
            description
            project {
                name
            }
        }
    }
`;

class Form extends Component {

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

        const mutate = project.created ? this.props.addRecord : this.props.addRecordWithProjectId;

        let variables = {
            startTime,
            endTime,
            date,
            description,
            userId: this.props.user.loggedInUser.id
        };

        variables = project.created ? Object.assign(variables, { project: project.value}) : Object.assign(variables, { projectId: project.value});

        mutate({
            variables,
            update: (proxy, { data: { createRecord }}) => {
                const data = proxy.readQuery({ query });
                data.user.records.push(createRecord);
                proxy.writeQuery({ query, data })
            }
        })
            .then(({ data }) => {

            })
            .catch(error => {
                this.setState({
                    error
                })
            });
    }

    onNewOption(value) {
        return { value: value.label, label: value.label, created: true };
    }

    getOtions() {

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
                        <Creatable
                            options={this.props.project.loading ? [] : this.props.project.allProjects.map(project => ({value: project.id, label: project.name}))}
                            onChange={(value) => this.setState({ project: value })}
                            newOptionCreator={this.onNewOption}
                            value={this.state.project}
                            required
                        />
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

export default compose(
    graphql(addRecord, { name: 'addRecord' }),
    graphql(addRecordWithProjectId, { name: 'addRecordWithProjectId' }),
    graphql(loggedInUser, { name: 'user' }),
    graphql(allProjects, { name: 'project' })
)(Form)