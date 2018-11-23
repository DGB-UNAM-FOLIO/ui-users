import _ from 'lodash';
import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { Link } from 'react-router-dom';
import queryString from 'query-string';
import {
  Badge,
  Accordion,
  List,
  Icon,
  Headline
} from '@folio/stripes/components';

/**
 * User-details "Loans" accordion pane.
 *
 * Show links to the open- and closed-loans in the body; include the
 * number of open-loans in the preview.
 */
class UserLoans extends React.Component {
  // "limit=1" on the openLoansCount and closedLoansCount fields is a hack
  // to get at the "totalRecords" field without pulling down too much other
  // data. Instead we should be able to construct a query to retrieve this
  // metadata directly without pulling any item records.
  // see https://issues.folio.org/browse/FOLIO-773
  static manifest = Object.freeze({
    loansHistory: {
      type: 'okapi',
      records: 'loans',
      GET: {
        path: 'circulation/loans?query=(userId==:{id})&limit=100',
      },
    },
    openLoansCount: {
      type: 'okapi',
      GET: {
        path: 'circulation/loans?query=(userId==:{id} and status.name<>Closed)&limit=1',
      },
    },
    closedLoansCount: {
      type: 'okapi',
      GET: {
        path: 'circulation/loans?query=(userId==:{id} and status.name==Closed)&limit=1',
      },
    },
    userid: {},
  });

  static propTypes = {
    resources: PropTypes.shape({
      loansHistory: PropTypes.shape({
        records: PropTypes.arrayOf(PropTypes.object),
      }),
    }),
    onClickViewOpenLoans: PropTypes.func.isRequired,
    onClickViewClosedLoans: PropTypes.func.isRequired,
    accordionId: PropTypes.string,
    expanded: PropTypes.bool,
    onToggle: PropTypes.func,
    location: PropTypes.shape({
      search: PropTypes.string,
      pathname: PropTypes.string,
    }),
  };

  render() {
    const {
      expanded,
      onToggle,
      accordionId,
      resources,
      location,
      onClickViewOpenLoans,
      onClickViewClosedLoans,
    } = this.props;

    const openLoansTotal = _.get(resources.openLoansCount, ['records', '0', 'totalRecords'], 0);
    const closedLoansTotal = _.get(resources.closedLoansCount, ['records', '0', 'totalRecords'], 0);
    const openLoansCount = (_.get(resources.openLoansCount, ['isPending'], true)) ? -1 : openLoansTotal;
    const closedLoansCount = (_.get(resources.closedLoansCount, ['isPending'], true)) ? -1 : closedLoansTotal;
    const loansLoaded = openLoansCount >= 0 && closedLoansCount >= 0;
    const displayWhenClosed = loansLoaded ? (<Badge>{openLoansCount}</Badge>) : (<Icon icon="spinner-ellipsis" width="10px" />);
    const query = location.search ? queryString.parse(location.search) : {};

    return (
      <Accordion
        open={expanded}
        id={accordionId}
        onToggle={onToggle}
        label={(
          <Headline size="large" tag="h3">
            <FormattedMessage id="ui-users.loans.title" />
          </Headline>)}
        displayWhenClosed={displayWhenClosed}
      >
        {loansLoaded ?
          <List
            listStyle="bullets"
            itemFormatter={(item, index) => (
              <li key={index}>
                <Link
                  id={item.id}
                  to={`${location.pathname}?${queryString.stringify({ ...query, layer: item.layer })}`}
                  onClick={item.onClick}
                >
                  <FormattedMessage id={item.formattedMessageId} values={{ count: item.count }} />
                </Link>
              </li>)}
            items={[
              {
                id: 'clickable-viewcurrentloans',
                onClick: onClickViewOpenLoans,
                count: openLoansCount,
                formattedMessageId: 'ui-users.loans.numOpenLoans',
                layer: 'open-loans',
              },
              {
                id: 'clickable-viewclosedloans',
                onClick: onClickViewClosedLoans,
                count: closedLoansCount,
                formattedMessageId: 'ui-users.loans.numClosedLoans',
                layer: 'closed-loans',
              },
            ]}
          /> : <Icon icon="spinner-ellipsis" width="10px" />
        }
      </Accordion>
    );
  }
}

export default UserLoans;
