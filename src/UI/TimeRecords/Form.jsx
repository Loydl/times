import React, { Component } from 'react';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import moment from 'moment';
import { Creatable } from 'react-select';
import { query } from './Table';

const currentUser = gql`
    {
        currentUser {
            id
            businessunitId
        }
    }
`;

const allProjects = gql`
    {
        allProjects {
            edges {
                node {
                    id
                    name
                }
            }
        }
    }
`;

const createTimesrecord = gql`
    mutation createTimerecordWithProjectId($input: TimesrecordInput!) {
        createTimesrecord(
            input: {
                timesrecord: $input
            }
        ) {
           timesrecord {
               id
               headline
               projectByProjectId {
                   name
               }
               timeRange {
                   start {
                       value
                   }
                   end {
                       value
                   }
               }
           }
        }
    }
`;


const createProject = gql`
    mutation createProject($name: String!, $businessUnitId: Int!) {
        createProject(
            input: {
                project: {
                    name: $name
                    customerId: 4
                    businessunitId: $businessUnitId
                }
            }
        ) {
            project {
                id
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


    async handleSubmit(e) {
        e.preventDefault();
        const { description, project, startTime, endTime, date } = this.state;

        let response = {};

        if(project.created) {
            const data = await this.props.createProject({
                variables: {
                    name: project.value,
                    businessUnitId: this.props.user.currentUser.businessunitId
                }
            });

            response.projectId = data.data.createProject.project.id
        }



        let variables = {
            input: {
                projectId: response.projectId ? response.projectId : project.value,
                authorId: this.props.user.currentUser.id,
                body: "body",
                businessunitId: this.props.user.currentUser.businessunitId,
                headline: description,
                timeRange: {
                    start: {
                        value: moment(`${date} ${startTime}`, 'YYYY-MM-DD HH:mm').toISOString(),
                        inclusive: true
                    },
                    end: {
                        value: moment(`${date} ${endTime}`, 'YYYY-MM-DD HH:mm').toISOString(),
                        inclusive: false
                    }
                }
            }
        };

       this.props.createTimerecord({
            variables,
            update: (proxy, { data: { createTimesrecord }}) => {
                const data = proxy.readQuery({ query });
                data.allTimesrecords.edges.push({
                    node: createTimesrecord.timesrecord,
                    __typename: "TimesrecordsEdge"
                });
                proxy.writeQuery({ query, data })
            }
        })
           .then(res => {
               console.log(res)
               this.setState({
                   description: '',
                   project: '',
                   startTime: '',
                   endTime: '',
                   date: '',
                   error: null
               })
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
                            options={this.props.project.loading ? [] : this.props.project.allProjects.edges.map(({ node }) => ({value: node.id, label: node.name}))}
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
    graphql(createTimesrecord, { name: 'createTimerecord' }),
    graphql(createProject, { name: 'createProject' }),
    graphql(currentUser, { name: 'user' }),
    graphql(allProjects, { name: 'project' })
)(Form)