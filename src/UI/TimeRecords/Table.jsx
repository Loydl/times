import React, { Component } from 'react';
import fire from '../../utils/fire';
import Loader from 'react-loader';

export default class Table extends Component {

    constructor() {
        super();

        this.state = {
            loading: true,
            timeRecords: [],
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.user && nextProps.user !== this.props.user) {
            this.setState({
                loading: true
            });
            fire.database().ref('timeRecords').child(nextProps.user.uid).on('value', snap => {
                snap.forEach(timeRecord => {
                    this.setState({
                        timeRecords: this.state.timeRecords.concat(timeRecord.val())
                    })
                });

                this.setState({
                    loading: false
                })
            })
        }
    }

    renderRows() {
        return this.state.timeRecords.map((timeRecord, i) => {
            return (
                <tr key={i}>
                    <td>{timeRecord.description}</td>
                    <td>{timeRecord.project}</td>
                    <td>{timeRecord.startTime}</td>
                    <td>{timeRecord.endTime}</td>
                    <td>{timeRecord.date}</td>
                </tr>
            )
        })
    }

    render() {
        return (
            <Loader loaded={!this.state.loading}>
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