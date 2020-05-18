import React, { FunctionComponent } from "react";
import { colors } from "../../assets/styles/variables";

interface IProps {
  errors: Array<any> | null;
}

const ErrorContainer: FunctionComponent<IProps> = ({ errors }) => {
  return (
    <>
      {errors && (
        <div style={styles.errorContainer}>
          {errors.map((error, index) => {
            return (
              <div
                style={{
                  ...styles.errorBox,
                  border: `2px solid ${colors.highlight.warning}`,
                }}
                key={index}
              >
                <p>
                  <b>Unprocessed Keys ({error.unprocessedKeys.length})</b>
                </p>
                {error.unprocessedKeys.map(
                  (keyString: string, index: number) => {
                    return <p key={index}>{keyString}</p>;
                  }
                )}
                <p>
                  <b>Reason:</b> {error.reason}
                </p>

                <p>
                  <b>How to Resolve:</b> {error.hint}
                </p>
              </div>
            );
          })}
        </div>
      )}
    </>
  );
};

const styles: { [name: string]: React.CSSProperties } = {
  errorContainer: {},
  errorBox: {
    margin: ".5rem auto",
    padding: "1rem",
    alignSelf: "center",
  },
};

export default ErrorContainer;
