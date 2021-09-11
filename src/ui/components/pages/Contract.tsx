import React from 'react';
import { useParams, Route, Switch, Redirect } from 'react-router-dom';
import { BookOpenIcon, PlayIcon } from '@heroicons/react/outline';
import { Interact } from '../contract/Interact';
import { NavLink } from '../sidebar/NavLink';
import { getInstanceFromStorage, call } from 'canvas';
import { useCanvas } from 'ui/contexts';
import { PageFull } from 'ui/templates';

type UrlParams = { addr: string; activeTab: string };

export const Contract = () => {
  const { api } = useCanvas();
  const { addr } = useParams<UrlParams>();
  const contract = getInstanceFromStorage(addr, api);
  const basePath = `/contract/${addr}`;

  return (
    <PageFull
      header={`${contract?.abi.project.contract.name} Contract`}
      help={`X instantiated this contract from CodeBundle on 31 Dec`}
    >
      <>
        <div className="grid grid-cols-12 w-full">
          <ul className="routed-tabs col-span-8">
            <li className="mr-4 ">
              <NavLink to={`${basePath}/metadata`} icon={BookOpenIcon}>
                Metadata
              </NavLink>
            </li>
            <li>
              <NavLink to={`${basePath}/interact`} icon={PlayIcon}>
                Interact
              </NavLink>
            </li>
          </ul>
        </div>
        <Switch>
          <Route exact path={`${basePath}/metadata`}>
            <p>to do</p>
          </Route>
          <Route exact path={`${basePath}/interact`}>
            <Interact contractAddress={addr} metadata={contract?.abi.json} callFn={call} />
          </Route>
          <Route>
            <Redirect to={`${basePath}/interact`} />
          </Route>
        </Switch>
      </>
    </PageFull>
  );
};
