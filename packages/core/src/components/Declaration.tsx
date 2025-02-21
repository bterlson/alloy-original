import { OutputSymbol, BinderContext } from "../binder.js";
import { createContext, useContext } from "../context.js";
import { Children } from "../jsx-runtime.js";
import { Refkey, refkey } from "../refkey.js";
import { ScopeContext } from "./Scope.js";

const DeclarationContext = createContext<OutputSymbol>();

export interface DeclarationProps {
  name?: string;
  refkey?: Refkey;
  symbol?: OutputSymbol<any, any>;
  children?: Children;
}
export function Declaration(props: DeclarationProps) {
  const currentDeclaration = useContext(DeclarationContext);
  if (currentDeclaration) {
    throw new Error("Cannot nest declarations");
  }

  const binder = useContext(BinderContext)
  if (!binder) {
    throw new Error("Need binder context to create declarations");
  }
  const scope = useContext(ScopeContext);
  if (!scope) {
    throw new Error("Need scope to create declaration");
  }
  
  let declaration;
  if (props.symbol) {
    declaration = props.symbol
  } else {
    const rk = props.refkey ? props.refkey : refkey(props.name);
    declaration = binder.createSymbol(props.name!, scope, rk);
  }
  
  return <DeclarationContext.Provider value={declaration}>
    {props.children}
  </DeclarationContext.Provider>
}