import React from 'react';
import styled from 'styled-components';
import { AutoRow, RowBetween, RowFixed } from 'components/Row';
import { ExternalLink, TYPE } from 'theme';
import { formatDollarAmount } from 'utils/numbers';
import Polling from './Polling';
import { useLatestPrices } from '../../data/balancer/useLatestPrices';
import { BALANCER_APP_LINK, BALANCER_DOCS_LINK } from '../../data/balancer/constants';

const Wrapper = styled.div`
    width: 100%;
    background-color: ${({ theme }) => theme.black};
    padding: 10px 20px;
`;

const Item = styled(TYPE.main)`
    font-size: 12px;
`;

const StyledLink = styled(ExternalLink)`
    font-size: 12px;
    color: ${({ theme }) => theme.text1};
`;

const TopBar = () => {
    const { ftm, beets } = useLatestPrices();

    return (
        <Wrapper>
            <RowBetween>
                <Polling />
                <AutoRow gap="6px">
                    <RowFixed>
                        <Item>FTM Price:</Item>
                        <Item fontWeight="700" ml="4px">
                            {formatDollarAmount(ftm)}
                        </Item>
                    </RowFixed>
                    <RowFixed>
                        <Item>BEETS Price:</Item>
                        <Item fontWeight="700" ml="4px">
                            {formatDollarAmount(beets)}
                        </Item>
                    </RowFixed>
                </AutoRow>
                <AutoRow gap="6px" style={{ justifyContent: 'flex-end' }}>
                    <StyledLink href={BALANCER_DOCS_LINK}>Docs</StyledLink>
                    <StyledLink href={BALANCER_APP_LINK}>App</StyledLink>
                </AutoRow>
            </RowBetween>
        </Wrapper>
    );
};

export default TopBar;
