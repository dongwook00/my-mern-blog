import React from "react";
import { Card, CardBody } from "reactstrap";
import CenterPiece from "../CenterPiece";

export interface ILoadingProps {
  dotType?: string;
}
export const Loading: React.FC<ILoadingProps> = props => {
  const { children, dotType } = props;
  return (
    <div className="text-center">
      <div className="stage">
        <div className={dotType}></div>
      </div>
        {children}
    </div>
  )
}

Loading.defaultProps = {
  dotType: "dot-bricks"
}

export interface ILoadingComponentProps {
  card?: boolean;
  dotType?: string;
}

export const LoadingComponent: React.FC<ILoadingComponentProps> = props => {
  const {card, children, dotType} = props;

  if (card) {
    return (
      <CenterPiece>
        <Card>
          <CardBody>
            <Loading dotType={dotType}>
              {children}
            </Loading>
          </CardBody>
        </Card>
      </CenterPiece>
    );
  }

  return (
    <Loading dotType={dotType}>
      {children}
    </Loading>
  );
}

LoadingComponent.defaultProps = {
  card: true,
  dotType: "dot-bricks"
}




export default LoadingComponent;