import React from "react";
import IActivity from "../../interface/activity";
import IDonation from "../../interface/donation";
import IPool from "../../interface/pool";
import IUser from "../../interface/user";

const PoolPDF = ({pool, sortedDonations, activity, user}: {pool?: IPool, sortedDonations?: IDonation[], activity?: IActivity, user?: IUser}) => {
  return(
    <div className="pdf-pool">
      <div className="pdf-top-home">
        <div className="pdf-activity-top">
          <div className="pdf-title">
            {activity?.attributes.name} - {pool?.attributes.name}
          </div>
        </div>
      </div>
      <div className="pdf-numbers">
        <div className="pdf-padding pdf-total">
          {pool?.attributes.totalDonation}€
        </div>
        <div className="pdf-padding pdf-goal">
          Objectif: {pool?.attributes.goal}€
        </div>
        <div className="pdf-separator"/>
      </div>
      <div className="pdf-donations">
        <div className="pdf-table">
          {
            sortedDonations?.map((donation: IDonation) => {
              return (
                <div key={donation.id} className="pdf-row">
                  <div className="pdf-user">
                    {user?.attributes.name} {user?.attributes.lastname}
                  </div>
                  <div className="pdf-donation">
                    {donation.attributes.somme}€
                  </div>
                </div>
              )
            })
          }
        </div>
      </div>
    </div>
  )
}

export default PoolPDF;
