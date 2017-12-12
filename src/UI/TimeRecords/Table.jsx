import React, { Component } from 'react';
import Loader from 'react-loader';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';

const query = gql`    
    {
        allTimesrecords {
            edges {
                node {
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
    }
`;

const deleteTimerecord = gql`
    mutation DeleteTimerecord($id: Int!) {
        deleteTimesrecordById(input: { id: $id}) {
            deletedTimesrecordId
        }
    }
`;


class Table extends Component {

    deleteTimerecord(id) {
        this.props.mutate({
            variables: {
                id
            },
            update: (proxy) => {
                const data = proxy.readQuery({ query });
                const index = data.allTimesrecords.edges.findIndex(edge => edge.node.id === id);
                if (index > -1) data.allTimesrecords.edges.splice(index, 1);
                proxy.writeQuery({ query, data })
            }
        })
            .then(res => {
                console.log(res)
            })
            .catch(err => {
                console.error(err)
            });
    }

    renderRows() {
        if(!this.props.data.loading && !this.props.data.error && this.props.data.allTimesrecords) {
            return this.props.data.allTimesrecords.edges.map(({ node }) => {
                return (
                    <tr key={node.id}>
                        <td>{node.headline}</td>
                        <td>{node.projectByProjectId.name}</td>
                        <td>{node.timeRange.start.value}</td>
                        <td>{node.timeRange.end.value}</td>
                        <td><button className="btn btn-primary" onClick={() => this.deleteTimerecord(node.id)}>X</button></td>
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

export default compose(
    graphql(deleteTimerecord),
    graphql(query)
)(Table);
export { query }