import React, { Component } from 'react';
import Loader from 'react-loader';

import { graphql } from 'react-apollo';
import gql from 'graphql-tag';

const query = gql`    
    {
        user {
            records {
                id
                date
                description
                startTime
                endTime
                project {
                    name
                }
            }
        }
    }
`;

class Table extends Component {

    renderRows() {
        if(!this.props.data.loading && !this.props.data.error && this.props.data.user) {
            return this.props.data.user.records.map((record) => {
                return (
                    <tr key={record.id}>
                        <td>{record.description}</td>
                        <td>{record.project.name}</td>
                        <td>{record.startTime}</td>
                        <td>{record.endTime}</td>
                        <td>{record.date}</td>
                    </tr>
                )
            })
        } else {
            return null;
        }
    }

    render() {
        return (
            <Loader loaded={!this.props.data.loading}>
                <table className="table">
                    <thead>
                        <tr>
                            <th scope="col">Description</th>
                            <th scope="col">Project</th>
                            <th scope="col">Start Time</th>
                            <th scope="col">End Time</th>
                            <th scope="col">Date</th>
                        </tr>
                    </thead>
                    <tbody>
                        {
                            this.renderRows()
                        }
                    </tbody>
                </table>
            </Loader>
        )
    }
}

export default graphql(query)(Table);
export { query }