import React from 'react';
import css from './MultiColumnList.css';

/*
 * Table component that uses an object
 */

const propTypes = {
   contentData:React.PropTypes.arrayOf(React.PropTypes.object)
};

const defaultProps = {
  contentData: []
};

class MultiColumnListUsers extends React.Component{
  constructor(props){
    super(props);
  }
  
  getTableStyle(){
    let tableStyle = css.multilist;
    this.props.fullWidth? tableStyle += " fullWidth": null;
    return tableStyle;
  }
  
  render(){
    const { contentData, onClickItemHandler } = this.props;
    //render content from contentData....
    var listItems = [];
    var columnHeaders;
    
    if(contentData){
      contentData.map(function(item, i){
        var listItem = [];
        var headers = [];
        var headerCells = [];

        for(var prop in item){
          if (prop !== "id") {
            //update listing headers
            headers.push(prop);

            //create value cells
            listItem.push(<td key={prop}>{item[prop]}</td>);
          }
        }

        listItems.push(<tr key={i} onClick={()=>onClickItemHandler(item.id)}>{listItem}</tr>);
        headers.map((header, i)=> headerCells.push(<th key={i}>{header}</th>), this);
        columnHeaders = <tr>{headerCells}</tr>;
      },
      this);
    }
    
    return(
      <div>
        <table className={this.getTableStyle()}>
          <thead>
            {columnHeaders}
          </thead>
          <tbody>
            {listItems}
          </tbody>
        </table>
      </div>
    );
  }
}

MultiColumnListUsers.propTypes = propTypes;
MultiColumnListUsers.defaultProps = defaultProps;

export default MultiColumnListUsers;