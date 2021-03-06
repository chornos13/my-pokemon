import React from 'react'
import { ReactComponentLike } from 'prop-types'
import Header from 'layouts/containers/Public/Header'
import Footer from 'layouts/containers/Public/Footer'
import { BackTop } from 'antd'
import {
  ContextHeader,
  useHeaderProps,
} from 'layouts/containers/Public/Header/Header'
import useStoragePokemon from 'hooks/useStoragePokemon/useStoragePokemon'
import ContextContainer from 'layouts/containers/Public/ContextContainer'

interface IProps {
  Component: ReactComponentLike
}

export const HEIGHT_HEADER = 56
export const HEIGHT_FOOTER = 107.5

function PublicContainer(props: IProps) {
  const { Component } = props
  const headerValue = useHeaderProps({
    title: 'Pokemon',
  })

  const storagePokemon = useStoragePokemon('myPokemon')

  return (
    <ContextContainer.Provider
      value={{
        storagePokemon,
      }}
    >
      <ContextHeader.Provider
        value={{
          ...headerValue,
        }}
      >
        <div style={{ minWidth: 280 }}>
          <Header {...headerValue.props} />
          <div
            style={{
              minHeight: `calc(100vh - ${HEIGHT_HEADER + HEIGHT_FOOTER}px)`,
            }}
          >
            <Component {...props} />
          </div>
          <Footer />

          <BackTop duration={50} />
        </div>
      </ContextHeader.Provider>
    </ContextContainer.Provider>
  )
}

export default PublicContainer
